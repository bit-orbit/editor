<script lang="ts">
  import cx from "clsx";
  import CameraPlus from "tabler-icons-svelte/icons/CameraPlus";
  import ToolbarButton from "$lib/components/ToolbarButton.svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { MAX_IMAGE_SIZE_IN_BYTES } from "$lib/constants";
  import type { Editor } from "svelte-tiptap";

  export let editor: Editor;

  let imageInputRef: HTMLInputElement;

  function insertImage(e: any) {
    if (!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (imageInputRef) {
      imageInputRef.value = "";
    }

    if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
      toast.push(`حجم تصاویر حداکثر میتواند ${MAX_IMAGE_SIZE_IN_BYTES / 1000000} مگابایت باشد`);
      return;
    }

    const arrayBufferReader = new FileReader();

    arrayBufferReader.onload = async (e) => {
      if (!e.target?.result) {
        return;
      }

      const imageMimes = [
        {
          mime: "image/png",
          pattern: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
        },
        {
          mime: "image/jpeg",
          pattern: [0xff, 0xd8, 0xff]
        },
        {
          mime: "image/webp",
          pattern: [
            0x52,
            0x49,
            0x46,
            0x46,
            undefined,
            undefined,
            undefined,
            undefined,
            0x57,
            0x45,
            0x42,
            0x50,
            0x56,
            0x50
          ]
        }
      ];

      const bytes = new Uint8Array(e.target.result as ArrayBuffer);

      const valid = imageMimes.some((mime) => mime.pattern.every((p, i) => !p || bytes[i] === p));

      if (!valid) {
        toast.push("تنها فایل های png, jpeg و webp قابل آپلود هستند");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/image", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();

        if (data.url) {
          editor
            .chain()
            .focus()
            .setFigure({
              src: data.url
            })
            .run();
        }
      } else {
        const error = await res.json();
        toast.push(error.message || "هنگام آپلود عکس خطایی رخ داد. لطفا دوباره امتحان کنید.");
      }
    };

    arrayBufferReader.readAsArrayBuffer(file.slice(0, 14));
  }

  const handleInputClick = () => {
    imageInputRef?.click();
  };
</script>

<ToolbarButton title="تصویر" on:click={handleInputClick}>
  <CameraPlus />
  <input
    bind:this={imageInputRef}
    type="file"
    accept="image/*"
    on:change={insertImage}
    class={cx(
      "w-full py-2 px-4",
      "hidden rounded rounded-8 border focus:outline-none bg-gray-100",
      "placeholder:text-right"
    )}
  />
</ToolbarButton>
