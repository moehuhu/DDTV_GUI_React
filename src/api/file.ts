import type { Response } from '@/types'
import type { FileTreeNode } from '@/types/response'
import { instance } from './instance'

export function getFileTree() {
  return instance.post<Response<FileTreeNode>>('file/get_file_structure', null, {
    timeout: 1000 * 60 * 5
  })
}
