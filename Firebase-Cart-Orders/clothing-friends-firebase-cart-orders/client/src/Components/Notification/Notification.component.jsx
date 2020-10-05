import React from 'react'
import { connect } from 'react-redux';
import './Notification.styles.scss';
import { createStructuredSelector } from 'reselect';
import { selectCurrentNotices } from '../../redux/notices/notices.selectors';


const Notification = (props) => props.notices !== null && props.notices.length > 0 && props.notices.map(notice => (
    <div key={notice.id} className={`notice notice-${notice.noticeType}`}>
        {notice.msg}
    </div>
));

const mapStateToProps = createStructuredSelector({
    notices: selectCurrentNotices,
});

export default connect(mapStateToProps)(Notification);
// export default Notification;