<template>
  <div class="container">
    <el-row>
      <el-col :span="4">
        <el-select v-model="project" @change="loadData" placeholder="项目">
          <el-option
            v-for="item in projectList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="16">
        <el-input
          placeholder="Filter"
          v-model="filterText"
          @change="filterHander"
        ></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tag
          >Total ( {{ tableData.length }} / {{ listData.length }} )</el-tag
        >
      </el-col>
      <el-col :offset="3" :span="3">
        <el-select v-model="filterZH" multiple placeholder="幢号">
          <el-option
            v-for="item in viewZHValueList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select class="fgroup1" v-model="filterDFL" placeholder="得房率">
          <el-option
            v-for="item in viewDFLValueList"
            :key="item.label"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :offset="1" :span="2">
        <el-checkbox v-model="isRoomlessCheck" border>无房户</el-checkbox>
      </el-col>
      <el-col :offset="1" :span="6">
        <el-checkbox-group v-model="filterHx" size="small">
          <el-checkbox-button v-for="hx in viewHxList" :label="hx" :key="hx">{{
            hx
          }}</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-table
      border
      cell-class-name="mycell"
      ref="filterTable"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="幢号" label="幢号" width="50"> </el-table-column>
      <el-table-column prop="房号" label="房号" width="80"> </el-table-column>
      <el-table-column prop="楼层" label="楼层" width="80" sortable>
      </el-table-column>
      <el-table-column prop="总价" label="总价" sortable> </el-table-column>
      <el-table-column prop="均价套内" label="均价套内" sortable>
      </el-table-column>
      <el-table-column prop="均价建筑" label="均价建筑" sortable>
      </el-table-column>
      <el-table-column prop="得房率" label="得房率" width="100" sortable>
      </el-table-column>
      <el-table-column prop="套内面积" label="套内面积" width="120" sortable>
      </el-table-column>
      <el-table-column prop="建筑面积" label="建筑面积" width="120" sortable>
      </el-table-column>
      <el-table-column prop="户型" label="户型" sortable> </el-table-column>
      <el-table-column prop="无房户" label="无房户" width="100" sortable>
        <template slot-scope="scope">
          <el-tag :type="!scope.row.isRoomless ? 'primary' : 'success'">{{
            scope.row["无房户"]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="楼栋" label="楼栋" min-width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import rawData from "../cooker/data/result.json";
import axios from "axios";

const getValues = (list, props) => {
  let ret = [];
  ret = list.map((d) => d[props]);
  return [""].concat(Array.from(new Set(ret))).map((d) => {
    return {
      key: d,
      label: d || props,
    };
  });
};

export default {
  data() {
    const viewHxList = ["4室2厅1厨2卫", "3室2厅1厨2卫"];
    return {
      isListLoading: false,
      rawData,
      listData: [],
      project: "春月金沙府",
      projectList: ["春月金沙府", "江逸源境府"],
      viewHxList,
      //filters
      filterText: "",
      filterZH: [],
      filterDFL: "",
      filterHx: [].concat(viewHxList),
      isRoomlessCheck: false,
    };
  },
  computed: {
    tableData: function () {
      if (Array.isArray(this.listData)) {
        return (
          this.listData
            .filter((d) => {
              return this.isRoomlessCheck ? d.isRoomless : true;
            })
            // .filter((d) => {
            //   return !this.filterZH || this.filterZH === d["幢号"];
            // })
            .filter((d) => {
              return (
                this.filterZH.length === 0 || this.filterZH.includes(d["幢号"])
              );
            })
            .filter((d) => {
              // return this.filterDFL === "all" || this.filterDFL === d["得房率"];
              return !this.filterDFL || this.filterDFL === d["得房率"];
            })
            .filter((d) => {
              return this.filterHx.includes(d["户型"]);
            })
            .filter((d) => {
              const regtxt = this.filterText.replace(/\\/gi, "");
              const summaryStr = Object.values(d).join(" ");
              return (
                !this.filterText || new RegExp(regtxt, "i").test(summaryStr)
              );
            })
        );
      } else {
        return [];
      }
    },
    viewDFLValueList: function () {
      return getValues(this.listData, "得房率");
    },
    viewZHValueList: function () {
      const viewZHValueList0 = getValues(this.listData, "幢号");
      viewZHValueList0.shift();
      return viewZHValueList0.map((d) => d.key);
    },
  },
  methods: {
    loadData: function () {
      if (!this.isListLoading && this.project) {
        this.isListLoading = true;
        axios
          .get(`./${this.project}.merged.json`)
          .then((res) => {
            this.listData = res.data;
          })
          .finally(() => {
            this.isListLoading = false;
          });
      } else {
        console.warn("==disable pararall call");
      }
      // this.$forceUpdate();
    },
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
  mounted: function () {
    this.loadData();
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
.fgroup1 {
  margin: 0 0.25rem;
}

@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .container {
    margin: 1rem;
  }
}
</style>
