<template>
  <el-dialog
    v-model="visible"
    :title="title"
    class="dialog-container"
    @close="handleClose"
    @closed="handleAfterClose"
    :show-close="false"
    draggable
    ref="dialogRef"
    align-center
    @opened="emit('opened')"
  >
    <div class="body">
      <div class="tree-container">
        <slot></slot>
      </div>
      <div class="selected-wrapper">
        <el-text>已选择{{ type }}</el-text>
        <el-scrollbar class="selected-scrollbar">
          <div
            v-for="item in selectedItems"
            :key="item.id"
            class="selected-item"
            @mouseenter="handleNodeMouseEnter(item.id)"
            @mouseleave="handleNodeMouseLeave"
          >
            <el-icon class="selected-icon">
              <Management v-if="!item.userFlag"/>
              <UserFilled v-if="item.userFlag"/>
            </el-icon>
            <el-text class="selected-label">{{ item.label }}</el-text>
            <el-text v-if="userDepartFlag && item.isMajor" type="info" size="small">主部门</el-text>
            <el-text v-else-if="item.id === hoverNodeId && !item.isMajor" text type="primary" size="small"
                     class="selected-set-major" @click="handleMajor(item.id)">设为主部门
            </el-text>
            <el-icon @click="handleRemoveItem(item.id)" class="selected-close"
            >
              <CloseBold
              />
            </el-icon>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="footer">
      <el-button @click="handleCancel" class="footer-button">取消</el-button>
      <el-button type="primary" @click="handleSave" class="footer-button"
      >确认
      </el-button
      >
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {CloseBold, Management, UserFilled} from '@element-plus/icons-vue'

const props = defineProps([
  'visible',
  'title',
  'selectedItems',
  'resultItems',
  'type',
  'userDepartFlag',
])
const emit = defineEmits([
  'update:visible',
  'update:selectedItems',
  'update:resultItems',
  'opened'
])
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})
const selectedItems = computed({
  get() {
    return props.selectedItems
  },
  set(val) {
    emit('update:selectedItems', val)
  },
})

const resultItems = computed({
  get() {
    return props.resultItems
  },
  set(val) {
    emit('update:resultItems', val)
  },
})

const isConfirm = ref(false)

/**
 * 移除选择的节点
 */
function handleRemoveItem(id: string) {
  selectedItems.value = selectedItems.value.filter(item => item.id !== id)
}

/**
 * 取消选择
 */
function handleCancel() {
  isConfirm.value = false
  visible.value = false
}

const dialogRef = ref()

/**
 * 关闭
 */
function handleClose() {
  if (!isConfirm.value) {
    selectedItems.value = []
  }
}

/**
 * 重置位置
 */
function handleAfterClose() {
  dialogRef.value.resetPosition()
}

/**
 * 确认
 */
function handleSave() {
  /*if (selectedItems.value.length === 0) {
    ElMessage.error("请至少选择一个" + props.title);
    return
  }*/
  resultItems.value = [...selectedItems.value]
  isConfirm.value = true
  visible.value = false
}

const hoverNodeId = ref('')

function handleNodeMouseEnter(id: string) {
  hoverNodeId.value = id
}

function handleNodeMouseLeave() {
  hoverNodeId.value = ''
}

/**
 * 设置主部门
 */
function handleMajor(id: string) {
  selectedItems.value.forEach(item => {
    if (item.isMajor) {
      item.isMajor = false
    }
    if (item.id === id) {
      item.isMajor = true
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'TreeDialog',
}
</script>

<style scoped lang="scss">
.dialog-container {
  .body {
    display: flex;
    flex-grow: 1;
    margin-top: 10px;

    .tree-container {
      width: 55%;
      height: 100%;
    }

    .selected-wrapper {
      width: 45%;
      padding: 5px 14px 10px 20px;
      border-left: 1px solid var(--el-menu-border-color);
      height: 340px;

      .selected-scrollbar {
        margin-top: 15px;

        .selected-item {
          margin: 5px 0 7px 0;
          display: flex;
          align-items: center;

          .selected-icon {
            margin-right: 5px;
            color: var(--el-color-primary-dark-2);
          }

          .selected-label {
            cursor: default;
            flex-grow: 1;
          }

          .selected-set-major {
            cursor: pointer;
          }

          .selected-close {
            margin-right: 7px;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 5px;

            &:hover {
              background-color: var(--el-color-primary-light-7);
            }
          }
        }
      }
    }
  }

  .footer {
    background-color: var(--el-color-info-light-9);
    padding: 6px;
    display: flex;
    justify-content: flex-end;

    .footer-button {
      width: 70px;
      height: 28px;
    }
  }
}
</style>

<style lang="scss">
.dialog-container {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 500px;
  padding: 0;

  .el-dialog__header {
    background-color: var(--el-color-primary-dark-2);
    padding: 10px;

    .el-dialog__title {
      color: var(--el-color-white);
      font-size: 14px;
    }
  }

  .el-dialog__body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
