<template>
  <el-row class="container">
    <el-col>
      <el-input
        placeholder="Filter"
        v-model="filterText"
        @change="filterHander"
      ></el-input>
    </el-col>
    <el-col>
      <el-row>
        <el-col :span="6">
          <el-tag style="margin-right: 5rem"
            >Total ( {{ tableData.length }} / {{ rawData.length }} )</el-tag
          >
        </el-col>
        <el-col :offset="8" :span="2">
          <el-checkbox v-model="isHomelessCheck" border>无房户</el-checkbox>
        </el-col>
        <el-col :offset="2" :span="6">
          <el-checkbox-group v-model="filterHx" size="medium">
            <el-checkbox-button
              v-for="hx in viewHxList"
              :label="hx"
              :key="hx"
              >{{ hx }}</el-checkbox-button
            >
          </el-checkbox-group>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4"> </el-col>
    <!-- <el-button @click="clearFilter">清除所有过滤器</el-button> -->
    <el-table
      border
      cell-class-name="mycell"
      ref="filterTable"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="楼栋" label="楼栋" width="180"> </el-table-column>
      <!-- <el-table-column prop="幢号" label="幢号" width="50"> </el-table-column> -->
      <el-table-column prop="房号" label="房号" width="80"> </el-table-column>
      <el-table-column prop="套内面积" label="套内面积" sortable>
      </el-table-column>
      <el-table-column prop="建筑面积" label="建筑面积" sortable>
      </el-table-column>
      <el-table-column prop="楼层" label="楼层" sortable> </el-table-column>
      <el-table-column prop="总价" label="总价" sortable> </el-table-column>
      <el-table-column prop="均价套内" label="均价套内" sortable>
      </el-table-column>
      <el-table-column prop="均价建筑" label="均价建筑" sortable>
      </el-table-column>
      <el-table-column prop="户型" label="户型" sortable> </el-table-column>
      <el-table-column prop="无房户" label="无房户" width="100" sortable>
        <template slot-scope="scope">
          <el-tag :type="!scope.row.isHomeless ? 'primary' : 'success'">{{
            scope.row["无房户"]
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
import rawData from "../cooker/data/result.json";

export default {
  data() {
    const viewHxList = ["4室2厅1厨2卫", "3室2厅1厨2卫"];
    return {
      viewHxList,
      rawData,
      filterText: "",
      filterHx: [].concat(viewHxList),
      isHomelessCheck: false,
    };
  },
  computed: {
    tableData: function () {
      return this.rawData
        .filter((d) => {
          return this.isHomelessCheck ? d.isHomeless : true;
        })
        .filter((d) => {
          return this.filterHx.includes(d["户型"]);
        })
        .filter((d) => {
          const regtxt = this.filterText.replace(/\\/gi, "");
          const summaryStr = [
            d["楼栋"],
            d["无房户"],
            d["户型"],
            d["楼层"],
          ].join(" ");
          return !this.filterText || new RegExp(regtxt, "i").test(summaryStr);
        });
    },
  },
  methods: {
    filterHander(value, row) {
      // return row["户型"] === value;
    },
    // filterType(value, row) {
    //   return row["户型"] === value;
    // },
    // filterHome(value, row) {
    //   return row["无房户"] === value;
    // },
  },
};
</script>

<style>
.container {
  margin: 2rem;
}
.container .el-col {
  padding: 0.5rem 0;
}
.mycell .cell {
  padding: 0 0.5rem;
}

@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .container {
    margin: 1rem;
  }
}
</style>
