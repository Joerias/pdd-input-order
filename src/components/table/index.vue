<script setup lang="ts">
type Props = {
	data?: any;
};

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
});
</script>

<template>
	<el-table :data="props.data" border stripe>
		<el-table-column prop="date" label="Date" width="180" />
		<el-table-column prop="name" label="Name" width="180" />
		<el-table-column prop="address" label="Address" />
	</el-table>
</template>

<style lang="less" scoped></style>
