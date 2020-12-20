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
      <el-col :offset="2" :span="2">
        <el-select v-model="filterZH" multiple placeholder="幢号">
          <el-option
            v-for="item in viewZHValueList"
            :key="item.label"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select
          class="fgroup1"
          v-model="filterDFL"
          multiple
          placeholder="得房率"
        >
          <el-option
            v-for="item in viewDFLValueList"
            :key="item.label"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          class="fgroup1"
          v-model="filterHx"
          multiple
          placeholder="户型"
        >
          <el-option
            v-for="item in viewHxList"
            :key="item.label"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :offset="0" :span="2">
        <el-checkbox v-model="isRoomlessCheck" border>无房户</el-checkbox>
      </el-col>

      <el-col class="bar-item" :offset="0" :span="6">
        <el-switch
          v-model="isCEInclude"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        <el-badge :value="ceTip" class="item-ceng">
          <el-select
            size="small"
            v-model="filterCE"
            multiple
            placeholder="楼层"
          >
            <el-option
              v-for="item in viewCEList"
              :key="item.label"
              :label="item.label"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-badge>
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
      <el-table-column
        prop="总价"
        label="总价"
        sortable
        :formatter="intFormatter"
      >
      </el-table-column>
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
import axios from "axios";
const projectList = ["春月金沙府", "江逸源境府", "春熙潮鸣府"];

const getValues = (list, props, isIncludeEmpty = false) => {
  let ret = [];
  if (isIncludeEmpty) {
    ret.push("");
  }
  const values = list.map((d) => d[props]);
  return ret.concat(Array.from(new Set(values))).map((d) => {
    return {
      key: d,
      label: d || props,
    };
  });
};

export default {
  data() {
    return {
      isListLoading: false,
      listData: [],
      project: projectList[0],
      projectList,
      viewCEList: [],
      viewHxList: [],
      viewDFLValueList: [],
      viewZHValueList: [],
      //filters
      filterText: "",
      filterZH: [],
      filterDFL: [],
      filterCE: [],
      filterHx: [],
      isRoomlessCheck: false,
      isCEInclude: true,
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
              return (
                this.filterDFL.length === 0 ||
                this.filterDFL.includes(d["得房率"])
              );
            })
            .filter((d) => {
              // console.log("====" + this.isCEInclude);
              let ret = true;
              if (this.filterCE.length === 0) {
                ret = true;
              } else {
                if (this.isCEInclude) {
                  ret = this.filterCE.includes(d["楼层"]);
                } else {
                  ret = !this.filterCE.includes(d["楼层"]);
                }
              }
              return ret;
            })
            .filter((d) => {
              return (
                this.filterHx.length === 0 || this.filterHx.includes(d["户型"])
              );
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
    ceTip: function () {
      return this.isCEInclude ? "包括" : "排除";
    },
  },
  methods: {
    loadData: function () {
      if (!this.isListLoading && this.project) {
        this.isListLoading = true;
        axios
          .get(`./${this.project}.merged.json?v=1`)
          .then((res) => {
            this.listData = res.data.map((d) => {
              const ret = { ...d };
              ret["楼层"] = parseInt(d["楼层"]);
              ret["总价"] = parseInt(d["总价"]);
              return ret;
            });
            this.viewDFLValueList = getValues(this.listData, "得房率");
            this.viewZHValueList = getValues(this.listData, "幢号");
            this.viewHxList = getValues(this.listData, "户型");
            this.viewCEList = getValues(this.listData, "楼层").sort(
              (a, b) => a.key - b.key
            );
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
    intFormatter(row, column) {
      // console.log(row, column);
      return parseInt(row[column.property]);
    },
    // intSorter(a, b) {
    //   return  parseInt(a) - parseInt(b);
    // },
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

.bar-item {
  margin-left: 1rem;
}

@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .container {
    margin: 1rem;
  }
}
</style>
