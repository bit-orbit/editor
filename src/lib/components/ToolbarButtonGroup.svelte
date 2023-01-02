<script lang="ts">
  import cx from "clsx";
</script>

<div class={cx("flex items-center gap-x-0.5", $$props.class)}>
  <slot />
</div>
