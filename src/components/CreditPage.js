import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProfilesApi } from "../redux/apiCalls/profileApiCall";
import { Link } from "react-router-dom";
import boldStar from "../img/star (1).png";
const CreditPage = () => {
  const { profiles } = useSelector((state) => state.profile);
  console.log(profiles);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProfilesApi());
  }, []);
  return (
    <div>
      <div class="container">
        {profiles?.map((item, index) => (
          <>
            {/* {item?.credit?.length < 0 && ( */}
            <Link className="text-dark" to={`/profile/${item._id}`}>
              <div class="box">
                <img className="my-img" src={item?.profilePhoto?.url} alt="" />
                <h3>{item?.username}</h3>
                <span>{item?.email}</span>
                <ul>
                  {Array(
                    Math.round(
                      (item?.likes?.length /
                        (item?.dislikes?.length + item?.likes?.length)) *
                        5
                    ) || 0
                  )
                    .fill()
                    .map((_, i) => (
                      <li>
                        <img src={boldStar} alt="" />
                      </li>
                    ))}
                </ul>
                <p>
                  ! Vel dolores maxime incidunt quos quidem odit. Voluptatibus
                  non quisquam tempore vel eum! Excepturi ex sit nulla quam
                  voluptate?
                </p>
              </div>
            </Link>
            {/* )} */}
          </>
        ))}
      </div>
    </div>
  );
};

export default CreditPage;
