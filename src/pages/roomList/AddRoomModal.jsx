import { Modal, Input, Switch, Form } from "antd"
import _ from 'lodash'
import useAddRoom from "../../hooks/useAddRoom"
import { useTranslation } from "react-i18next"
import { useSystemSettingsStore } from "../../SystemSettingsStore"

const AddRoomModal = (props) => {
    const { addingRoom, setAddingRoom, messageApi, refreshPage } = props
    const isOpen = !_.isEmpty(addingRoom)
    const idType = {
        addByUID: 'uid',
        addByRoomID: 'roomID'
    }[addingRoom?.type] || 'roomID'

    const { submitRoom, isLoading } = useAddRoom()
    const [form] = Form.useForm()
    const confirm = () => form.submit()
    const closeModal = () => {
        form.resetFields()
        setAddingRoom?.({})
    }
    const onFinish = async (values) => {
        const [err] = await submitRoom(values)
        if (err) {
            messageApi.error(err?.message)
            return
        }
        messageApi.success('√')
        closeModal()
        refreshPage()
    }

    const { t } = useTranslation()
    const { recDanmu, autoRec, remind } = useSystemSettingsStore(state => state)
    const roomForm = <Form form={form} onFinish={onFinish}>
        <Form.Item label={t(idType)} name={idType} rules={[{ required: true, message: '' }]}>
            <Input />
        </Form.Item>
        <Form.Item label={t('recDanmu')} name={'recDanmu'} initialValue={recDanmu}>
            <Switch />
        </Form.Item>
        <Form.Item label={t('autoRec')} name={'autoRec'} initialValue={autoRec}>
            <Switch />
        </Form.Item>
        <Form.Item label={t('remind')} name={'remind'} initialValue={remind}>
            <Switch />
        </Form.Item>
    </Form>

    const modalWrapper = (content) => <Modal
        destroyOnClose
        closeIcon={null}
        open={isOpen}
        okText={t('Confirm')}
        cancelText={t('Cancel')}
        onOk={confirm}
        confirmLoading={isLoading}
        onCancel={closeModal}>
        {content}
    </Modal>

    return modalWrapper(roomForm)
}
export default AddRoomModal