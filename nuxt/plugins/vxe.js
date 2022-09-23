import Vue from 'vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

VXETable.formats.add()
VXETable.formats.mixin({
    formatStatus({ cellValue }) {
        return cellValue == 0 || cellValue == null ? '停用' : '可用'
    },
    formatID({ cellValue }, digits = 10) {
        return (Array(digits).join(0) + parseInt(cellValue)).slice(-digits)
    }
})

Vue.use(VXETable)
