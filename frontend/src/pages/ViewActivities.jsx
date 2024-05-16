import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../redux/Activitiy/actions/ActivityAction';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

const ViewActivities = () => {

    const dispatch = useDispatch();
    const activities = useSelector((state) => state.activities.activities);


    useEffect(() => {
        dispatch(fetchActivities());
    }, [])
    return (
        <div>
            <MDBCarousel showIndicators showControls fade>

                <MDBCarouselItem itemId={1}>
                    <img src='https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2017-01/Getty_515070156_EDITORIALONLY_LosAngeles_HollywoodBlvd_Web72DPI_0.jpg?h=0a8b6f8b&itok=lst_2_5d' className='d-block' alt='...'  style={{width:'1000px', height:'500px'}}/>
                    <MDBCarouselCaption>
                        <h5>First slide label</h5>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>

                <MDBCarouselItem itemId={2}>
                    <img src='https://static.toiimg.com/photo/107025787.cms' className='d-block' alt='...' style={{width:'1000px', height:'500px'}} />
                    <MDBCarouselCaption>
                        <h5>Second slide label</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>

                <MDBCarouselItem itemId={3}>
                    <img src='https://t3.ftcdn.net/jpg/02/76/21/66/360_F_276216647_1VykbMxnVdFhEAussykFqv16TATSeSGV.jpg' className='d-block' alt='...'  style={{width:'1000px', height:'500px'}} />
                    <MDBCarouselCaption>
                        <h5>Third slide label</h5>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>
            </MDBCarousel>
            <div className='d-flex flex-row'>
                {activities.map((activity) => (
                    <div class="card d-flex" style={{ width: '18rem' }}>
                        <img src={activity.image} alt={activity.name} />
                        <div class="card-body">
                            <h5 class="card-title">{activity.name}</h5>
                            <p class="card-text">{activity.description}</p>
                            <a href="#" class="btn btn-primary">Add Activity</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewActivities