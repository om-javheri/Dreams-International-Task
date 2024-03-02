import React, { useState, useEffect } from 'react';

function ShowAndBook(loginID) {
  console.log(loginID.loginID)
  const [concertData, setConcertData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,setItemsPerPage] = useState(5);


const [collapse,setCollapse]=useState(true)
 useEffect(() => {
  fetch("http://localhost:8081/ShowAndId")
    .then((res) => res.json())
    .then((data) => {
      
      if (data.message) {
        const filteredData = data.filter(item => item.author_id == loginID.loginID);

        setConcertData(filteredData)
      console.log(data[0])
      } else {
        const filteredData = data.filter(item => item.author_id == loginID.loginID);
        setConcertData(filteredData)
setOriginalConcertData(filteredData)
        setConcertData2(filteredData)

        console.log(filteredData);
      
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
},[]); // Include loginID.loginID in the dependency array
 // Make sure to pass an empty dependency array if you only want to fetch data once when the component mounts
    

    
  const [concertData2, setConcertData2] = useState([]);
  const [searchedId, setSearchedId] = useState('');
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = concertData.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems2 = concertData2.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    

    const singleSearch = () => {
      // Filter the data based on the entered ID
      const filteredData = concertData.filter((student) => student.id === parseInt(searchedId));
      
      setConcertData2(filteredData);
      setCollapse(false)

    };

const [reviewData,setReviewData]=useState([])

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/ShowReview');
        const data = await response.json();
        if (Array.isArray(data)) {

          setReviewData(data);
        } else {
          setReviewData([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setReviewData([]);
      }
    };
    const ShowReview=()=>{
      fetchData();
    }
    const [originalConcertData, setOriginalConcertData] = useState([]);

    const currentReviewItems = reviewData.slice(indexOfFirstItem, indexOfLastItem);
    const handleRadioClick = (status) => {
      if (status === "Published") {
        setConcertData(originalConcertData.filter((student) => student.status === "Published"));
      } else if (status === "Draft") {
        setConcertData(originalConcertData.filter((student) => student.status === "Draft"));
      }
    };
  return (
    <>
    <div className=' text-center'>
      <h5 className='colorw'>All Books List</h5>
      <p className='colorw'>Items per page: <input type='number' onChange={(e)=>setItemsPerPage(e.target.value || 5)}  /> </p> 
      <div className='text-center table-box center2 display'>
        <div className='left'>
          <table className="table2">
            <thead >
              <tr >
                <th >Book ID</th>
                <th>Cover</th>
                <th>
  Title 
  <input 
    type='text' 
    placeholder='Find by title' 
    onChange={(e) => {
      if(e.target.value){
      setConcertData(concertData.filter((student) => student.title.toLowerCase().includes(e.target.value.toLowerCase())));}
      else{
        setConcertData(concertData2)
      }
    }
}
  />
</th>

                <th>Genre
                <input 
    type='text' 
    placeholder='Find by title' 
    onChange={(e) => {
      if(e.target.value){
      setConcertData(concertData.filter((student) => student.title.toLowerCase().includes(e.target.value.toLowerCase())));}
      else{
        setConcertData(concertData2)
      }
    }
}
  />

                </th>
                <th>Price</th>

                <th>
  Status
  <br />
  <input 
    type='radio' 
    name='status'
    onClick={() => handleRadioClick("Published")}

  />
  Published

  <input 
    type='radio' 
    name='status'
    onClick={() => handleRadioClick("Draft")}

  />
  Draft
</th>

              </tr>
            </thead>
            <tbody className='tbody'>
              {currentItems.map((student, index) => (
                <tr key={index}>
                  <td>{student.id}</td>
                  <td>{student.cover}</td>
                  <td>{student.title}</td>
                  <td>{student.genre}</td>
                  <td>{student.price}</td>
                  <td>{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="pagination">
          {Array.from({ length: Math.ceil(concertData.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => paginate(page)} className={`btn ${currentPage === page ? 'btn-success' : 'btn-warning'}`}>
              {page}
            </button>
          ))}
        </div>
  
        <div>
          <input type="number" className='border'  onChange={(e) => setSearchedId(e.target.value)} placeholder="Enter Student ID" />
          <button type="button" className='button border' onClick={singleSearch}>Search</button>
        </div>
      </div>
    </div>
  
    {collapse ?
      <></> :
      <div className='text-center center2'>
        <table className="table2">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Author ID</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Description</th>
              <th>Genre</th>
              <th>Publish Date</th>
              <th>Price</th>
              <th>#Tags</th>
              <th>Reviews</th> {/* Add a new column for reviews */}
            </tr>
          </thead>
          <tbody className='tbody'>
            {currentItems2.map((student, index) => (
              <tr key={index}>
                <td>{student.id}</td>
                <td>{student.author_id}</td>
                <td>{student.cover}</td>
                <td>{student.title}</td>
                <td>{student.description}</td>
                <td>{student.genre}</td>
                <td>{student.publishDate}</td>
                <td>{student.price}</td>
                <td>{student.tags}</td>
                <td><button onClick={ShowReview} >See Reviews</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    }
     <div className='text-center center2'>
        <table className="table2">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Comment</th>
              <th>Rating</th>
              
            </tr>
          </thead>
          <tbody className='tbody'>
            {currentReviewItems.map((student, index) => (
              <tr key={index}>
                <td>{student.id}</td>
                <td>{student.comment}</td>
                <td>{student.rating}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  </>
  
  )
}
export default ShowAndBook;

