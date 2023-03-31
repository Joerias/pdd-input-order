<script setup lang="ts" name="table">
import { IImportTableItem } from "@type/index";

type Props = {
	data?: IImportTableItem[];
	label?: string;
};

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
});
</script>

<template>
	<el-table class="mt10" v-if="props.data.length !== 0" :data="props.data" border stripe>
		<template v-if="props.label">
			<el-table-column align="center" :label="props.label">
				<el-table-column prop="order_sn" label="order" width="180" />
				<el-table-column prop="nashipping_name" label="nashipping" width="180" />
				<el-table-column prop="shipping_sn" label="shipping" />
			</el-table-column>
		</template>
		<template v-else>
			<el-table-column prop="order_sn" label="order" width="180" />
			<el-table-column prop="nashipping_name" label="nashipping" width="180" />
			<el-table-column prop="shipping_sn" label="shipping" />
		</template>
	</el-table>
</template>

<style lang="less" scoped></style>
