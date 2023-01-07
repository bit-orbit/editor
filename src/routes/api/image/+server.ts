import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { nanoid } from "nanoid";
import { error, json } from "@sveltejs/kit";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { MAX_IMAGE_SIZE_IN_BYTES } from "$lib/constants";
import { fileTypeFromBuffer } from "file-type";
import { Blob } from "node:buffer";

const client = new S3Client({
  region: "default",
  endpoint: env.S3_BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_BUCKET_ACCESS_KEY,
    secretAccessKey: env.S3_BUCKET_SECRET_KEY
  }
});

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.formData();
  const image = payload.get("image");

  if (!image || !(image instanceof Blob)) {
    throw error(400, {
      message: "اطلاعات ورودی صحیح نمیباشد"
    });
  }

  const imageArrayBuffer = await image.arrayBuffer();
  const filetype = await fileTypeFromBuffer(imageArrayBuffer);

  if (!filetype || !["image/png", "image/jpeg", "image/webp"].includes(filetype.mime)) {
    throw error(400, {
      message: "این نوع فایل قابل بارگزاری نمیباشد"
    });
  }
  if (image.size > MAX_IMAGE_SIZE_IN_BYTES) {
    throw error(400, {
      message: "حجم فایل بیشتر از حد مجاز است"
    });
  }
  const filename = `${nanoid()}.${filetype.ext}`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: filename,
        Body: Buffer.from(imageArrayBuffer),
        ACL: "public-read"
      })
    );
  } catch (e) {
    throw error(500, {
      message: "هنگام آپلود عکس خطایی رخ داد. لطفا دوباره امتحان کنید"
    });
  }

  return json({
    url: env.S3_IMAGE_ENDPOINT + "/" + filename
  });
};
