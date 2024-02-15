import { Modal, Switch, Form, Skeleton, Divider, Card, Button, Popconfirm } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import RoomCover from "./RoomCard/RoomCover"
import { useUpdateEffect } from "ahooks"
import _ from 'lodash'
import useSetRoom from "../../hooks/useSetRoom"
import { useTranslation } from "react-i18next"
import useRoomInfo from "../../hooks/useRoomInfo"
import useDelRoom from "../../hooks/useDelRoom"

const SetRoomModal = (props) => {
    const { editingRoom, setEditingRoom, messageApi, refreshPage } = props
    const isOpen = !_.isEmpty(editingRoom)
    const uid = editingRoom?.userInfo?.uid
    const { getRoomByUID, isLoading: isLoadingRoomInfo, roomInfo } = useRoomInfo()
    const [form] = Form.useForm()
    useUpdateEffect(() => {
        uid && getRoomByUID(uid)
    }, [editingRoom])
    useUpdateEffect(() => {
        form.setFieldsValue(roomInfo)
    }, [roomInfo])
    const confirm = () => form.submit()
    const closeModal = () => {
        form.resetFields()
        setEditingRoom?.({})
    }
    const { setRoom, isLoading } = useSetRoom()
    const onFinish = async (values) => {
        const [err] = await setRoom({ ...values, uid })
        if (err) {
            messageApi.error(err?.message)
            return
        }
        messageApi.success('√')
        closeModal()
        refreshPage()
    }
    const { deleteRoom } = useDelRoom()
    const handleDelete = async () => {
        const [err] = await deleteRoom(uid)
        if (err) {
            messageApi.error(err?.message)
            return
        }
        closeModal()
        refreshPage()
    }

    const { t } = useTranslation()
    const roomForm = <Skeleton loading={isLoadingRoomInfo}><Form
        form={form}
        onFinish={onFinish}
        initialValues={roomInfo}>
        <Form.Item label={t('recDanmu')} name={'IsRecDanmu'}>
            <Switch />
        </Form.Item>
        <Form.Item label={t('autoRec')} name={'IsAutoRec'}>
            <Switch />
        </Form.Item>
        <Form.Item label={t('remind')} name={'IsRemind'}>
            <Switch />
        </Form.Item>
    </Form></Skeleton>

    const footer = [
        <Popconfirm
            key={'delete'}
            title={t('Delete the room')}
            description={t('Are you sure to delete this room?')}
            onConfirm={handleDelete}
            okText={t('Confirm')}
            cancelText={t('Cancel')}>
            <Button danger type="primary" icon={<DeleteOutlined />} />
        </Popconfirm>,
        <Button key={'cancel'} onClick={closeModal}>{t('Cancel')}</Button>,
        <Button key={'confirm'} type="primary" loading={isLoading} onClick={confirm}>{t('Confirm')}</Button>
    ]

    const modalWrapper = (content) => <Modal
        destroyOnClose
        closeIcon={null}
        open={isOpen}
        footer={footer}
        onOk={confirm}
        mask={false}
        confirmLoading={isLoading}
        className="set-room-modal"
        onCancel={closeModal}>
        <Card>
            <RoomCover {...editingRoom} />
            <Divider />
            {content}
        </Card>
    </Modal>

    return modalWrapper(roomForm)
}
export default SetRoomModal