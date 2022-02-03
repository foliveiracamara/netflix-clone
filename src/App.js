import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css'
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      //pegando a lista total de filmes
      let list = await Tmdb.getHomeList();  
      setMovieList(list);
      
      //pegando o featured movie (filme em destaque no topo da page)
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length))
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      
    }

    loadAll();

  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return() => {
      window.removeEventListener('scroll', scrollListener);
    }


  }, [])

  return (
    <div className='page'>

      <Header black={blackHeader}/>

      {featuredData && <FeaturedMovie item={featuredData}/>}
      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
        Feito com <span role="img" aria-label='coracao'>❤️</span><br></br>
        Direitos para Netflix
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
            <img src="https://c.tenor.com/Rfyx9OkRI38AAAAC/netflix-netflix-startup.gif"
            alt='loading'></img>
        </div>
      }
    </div>
  
  )
}