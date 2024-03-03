import { Menu, Spin, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './style.css'
import { useTranslation } from 'react-i18next';
import SearchType from '../../enums/search_type';
import _ from 'lodash'
import { useState } from 'react';

const RoomListHeader = (props) => {
    const { isLoading, setPageState, searchType, search, setAddingRoom } = props
    const [searchBarOpen, setSearchBarOpen] = useState(false)

    const { t } = useTranslation()
    const spinIcon = <Spin size='small' spinning={isLoading} delay={500} />
    const showSpin = (key) => (key == searchType) && isLoading && spinIcon
    const getLabel = (key) => ({ label: t(key), key, icon: showSpin(key) })
    const searchTypeKeys = _(SearchType).keys().filter(item => _.isNaN(Number(item))).slice(0, 5)
    const onSearch = (search) => {
        setPageState({ current: 1, searchType: 'All', search })
        setSearchBarOpen(false)
    }
    const searchBar = <Input.Search
        defaultValue={search}
        count={{ show: true, max: 16 }}
        maxLength={16}
        placeholder={t('displayName')}
        allowClear={true}
        onSearch={onSearch}
    />
    const searchBarModal = <Modal
        destroyOnClose
        open={searchBarOpen}
        onCancel={() => setSearchBarOpen(false)}
        closeIcon={false}
        footer={null}
    >
        {searchBar}
    </Modal>
    const searchTypes = [
        {
            label: t('Add'),
            key: 'Add',
            className: 'add-btn',
            children: [
                { label: t('addByUID'), key: 'addByUID' },
                { label: t('addByRoomID'), key: 'addByRoomID' }
            ]
        },
        ...searchTypeKeys.map(getLabel),
        {
            icon: <SearchOutlined />,
            label: search,
            key: 'search',
            className: 'search-btn',
            onClick: () => setSearchBarOpen(true)
        }
    ]
    const onClick = ({ key }) => {
        if (['addByUID', 'addByRoomID'].includes(key)) {
            setAddingRoom?.({ type: key })
            return
        }
        if ('search' == key) {
            return
        }
        setPageState?.({ current: 1, searchType: key, search: undefined })
    }
    const header = <Menu
        onClick={onClick}
        style={{ minWidth: 0, flex: "auto" }}
        selectedKeys={[searchType]}
        items={searchTypes}
        mode="horizontal"
    />

    return <>{header}{searchBarModal}</>
}
export default RoomListHeader