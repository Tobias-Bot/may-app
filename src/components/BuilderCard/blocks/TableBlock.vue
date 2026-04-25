<!-- filepath: /src/components/BuilderCard/blocks/TableBlock.vue -->
<template>
  <div class="table-block">
    <div class="table-container">
      <table class="data-table">
        <tbody>
          <tr v-for="(row, rowIdx) in tableData" :key="rowIdx">
            <td v-for="(cell, colIdx) in row" :key="colIdx">
              <div 
                class="cell-content"
                contenteditable="true"
                @blur="updateCell(rowIdx, colIdx, $event.target.innerText)"
                @keydown.enter.prevent="$event.target.blur()"
              >{{ cell || '' }}</div>
            </td>
           </tr>
        </tbody>
       </table>
    </div>
    <div class="table-footer">
      <span class="table-size">{{ rows }} × {{ cols }}</span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'TableBlock',
  props: { data: { type: Object, default: () => ({ rows: 3, cols: 3, data: null }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const rows = ref(props.data?.rows || 3);
    const cols = ref(props.data?.cols || 3);
    const tableData = ref([]);
    
    const initTable = () => {
      if (props.data?.data && Array.isArray(props.data.data) && props.data.data.length > 0) {
        tableData.value = JSON.parse(JSON.stringify(props.data.data));
      } else {
        tableData.value = Array(rows.value).fill().map(() => Array(cols.value).fill(''));
      }
    };
    
    const updateCell = (rowIdx, colIdx, value) => {
      if (tableData.value[rowIdx] && tableData.value[rowIdx][colIdx] !== undefined) {
        tableData.value[rowIdx][colIdx] = value;
        save();
      }
    };
    
    const save = () => {
      emit('update', {
        rows: rows.value,
        cols: cols.value,
        data: tableData.value
      });
    };
    
    watch(() => props.data, () => {
      initTable();
    }, { deep: true, immediate: true });
    
    initTable();
    
    return { rows, cols, tableData, updateCell };
  }
}
</script>

<style scoped>
.table-block {
  width: 100%;
  overflow-x: auto;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(26, 59, 59, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table td {
  border: 1px solid rgba(26, 59, 59, 0.1);
  padding: 0;
  min-width: 80px;
}

.cell-content {
  padding: 0.6rem;
  min-height: 40px;
  outline: none;
  cursor: text;
  white-space: pre-wrap;
  word-break: break-word;
  transition: background 0.2s ease;
}

.cell-content:hover {
  background: rgba(26, 59, 59, 0.03);
}

.cell-content:focus {
  background: rgba(26, 59, 59, 0.05);
}

.table-footer {
  margin-top: 0.5rem;
  text-align: right;
  font-size: 0.7rem;
  color: #8a9a9a;
}
</style>