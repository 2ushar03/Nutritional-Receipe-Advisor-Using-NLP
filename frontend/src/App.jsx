// import { useState } from 'react'
// import './App.css'
// import { useEffect } from 'react'

// function App() {
//   const [data, setData] = useState({})
//   useEffect(()=>{
//     fetchData();
//   })
//   const fetchData=async()=>{
//     try{
//       const response=await fetch('http://localhost:5000/')
//       const jsonData=await response.json();
//       setData(jsonData)
//     }
//     catch(error){
//       console.log('Error',error)
//     }
//   }
//   return (
//     <>
//     <h1>HELLO</h1>
//     <h2>{data.message}</h2>
//     </>
//   )
// }

// export default App


import React, { useState } from 'react';
// import image from "./image.png"
import "./style.css";

const RecommendationForm = () => {
  const [dietType, setDietType] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/recommend?diet_type=${encodeURIComponent(dietType)}&ingredients=${encodeURIComponent(ingredients)}`);
      if (!response.ok) {
        throw new Error('Network Error');
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="bg-[url('./image.png')] min-h-screen w-full bg-center-bottom bg-no-repeat bg-cover mb-8 md:bg-cover md:min-h-[640px]">
    <div>
      <div className="bg-[url('./image.png')] min-h-screen w-full bg-center-bottom bg-no-repeat bg-cover mb-8 md:bg-cover md:min-h-[350px]">
      <h2 className="text-4xl pt-5 text-white grid place-content-center pb-4 md:text-6xl font-serif">Nutritional Recipe Advisor</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="dietType" className='text-white ml-28 pl-7 text-2xl  md:text-4xl md:m-14 md:ml-60'>Diet Type:</label>
        <input className='p-2 ml-9 rounded-md mb-5 md:p-3 md:7 md:ml-5'
          type="text"
          id="dietType"
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          required
        />
        <br />
        <label htmlFor="ingredients" className='text-white text-2xl ml-28 pl-7 md:text-4xl md:m-8 md:ml-60'>Ingredients:</label>
        <input className='p-2 ml-4 rounded-md mb-5 md:7 md:p-3'
          type="text"
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="float-right text-white text-center p-3 rounded-xl hover:bg-white hover:text-black bg-green-600 md:float-right mr-60 md:bg-orange-500">Recommend</button>
      </form>
      <h3 className='text-white text-2xl ml-3 md:text-4xl'>Recommendations:</h3>
      </div>
      <div className='-mt-8'>
        <ul className='mb-4 bg-black text-white pl-3 pr-3 text-base md:text-xl'>
          {recommendations.map((item, index) => (
            <li key={index} className='bg-yellow-100 mt-5 rounded-md mb-5 p-4'>
              <h4 className='text-2xl font-serif text-black pb-3'>{item.name_of_Dish}</h4>
              <p className='text-justify text-yellow-900'>{item.Recipe_Instructions}</p>
              <p className='text-black font-serif pb-2'>Ratings: {item.Ratings_of_Dish}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default RecommendationForm;
