import React, { useEffect, useState } from "react";
import Results from "./Results";
import axios from "axios";
import * as AppConstant from "./AppConstant";
import useDropdown from "./useDropdown";

const SearchArea = () =>{
    const [keyword, setKeyword] = useState();
    const [videos, setVideo] = useState([]);
    const orderList = ["date", "relevance", "rating", "title", "viewCount"];
    const [order, OrderDropdown] = useDropdown("Order By", "relevance", orderList);

    const [safeSearch, SafesearchDropdown] = useDropdown("Safe Search", "none", ["moderate","none","strict"]);
    const [checked, setChecked] = useState(false);
    const [advancedParams, setAdvancedParams] = useState(``);

    useEffect(() => {
        if (checked) {
          setAdvancedParams(`&order=${order}&safeSearch=${safeSearch}`);
        } else {
          setAdvancedParams(``);
        }
      }, [checked, order, safeSearch]);

    function requestSearch() {
        axios.get(`${AppConstant.SEARCH_URL}&q=${keyword}${advancedParams}`)
        .then((res)=>{
            const {items} = res.data;
            setVideo(items);
        })
        .catch((err)=> console.log(err));
    }
    return (
        <div className="search-area">
            <form onSubmit={ (e) => {
            e.preventDefault();
            requestSearch();
            }}>
                <label htmlFor="keyword">
                    Search
                    <input type="text" id="keyword" value={keyword} onChange={(e) =>setKeyword(e.target.value)}/>
                </label>
                <label htmlFor="advanced">
                    Advanced Search            
                    <input type="checkbox" id="advanced" checked={checked} onChange={()=>setChecked(!checked)}/>    
                </label>
                {checked ? (
          <div>
            <OrderDropdown />
            <SafesearchDropdown />
          </div>
        ) : null}
                <button>Submit</button>
            </form>
            <Results videos={videos}/>
        </div>
    )
}
export default SearchArea;