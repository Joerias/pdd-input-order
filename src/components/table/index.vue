<script setup lang="ts" name="tables">
import { computed } from "vue";
import config from "@/config";

type Props = {
	data: any[];
	label: string;
	total?: number;
	borderColor?: string;
};
const props = withDefaults(defineProps<Props>(), {
	total: 0,
	borderColor: "blue",
});

const label = computed(() => {
	return props.total ? `${props.label}  总价:${props.total}` : props.label;
});
</script>

<template>
	<div v-if="props.data.length !== 0" class="box mt10" :class="props.borderColor">
		<el-table :data="props.data" border stripe>
			<el-table-column align="center" :label="label">
				<el-table-column v-for="(o, i) in Object.keys(props.data[0])" :prop="o" :label="o" />
			</el-table-column>
		</el-table>
	</div>
</template>

<style lang="less" scoped>
.box {
	border-width: 1px;
	border-style: solid;
	border-radius: @radius;
	&.blue {
		border-color: @col-blue;
	}
	&.green {
		border-color: @col-green;
	}
	&.yellow {
		border-color: @col-yellow;
	}
}
</style>
