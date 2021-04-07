import React, {Fragment, useEffect} from 'react';
import { Link , withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import Spinner from '../layouts/Spinner';
import { connect } from 'react-redux';
import { getProfilebyid } from '../../actions/profile';

const Profile = ({getProfilebyid, profile:{profile,loading}, auth ,match}) => {
    useEffect(() => {
        getProfilebyid(match.params.id);
    },[getProfilebyid]);

    return(
        <Fragment>
            {profile == null || loading ? <Spinner/>:<Fragment>
               <Link to='/profiles' className='btn btn-light'>
                   Back To Profiles
               </Link>
               {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&(<Link to='/edit-profile' className='btn btn-dark'>Edit Prodile</Link> )} 
                </Fragment>}
            </Fragment>

    )
}

Profile.propTypes = {
    getProfilebyid: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    profile:state.profile,
    auth: state.auth
})


export default connect(mapStateToProps,{getProfilebyid})(Profile)

