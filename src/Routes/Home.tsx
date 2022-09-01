import { motion, AnimatePresence, Variants, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {
  getMovies,
  getPopularMovies,
  IGetMoviesResult,
  IGetPopularResult,
} from "./../api";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  height: 400vh;
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  width: 100%;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  margin-left: 40px;
  width: 95%;
  height: 100px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 64px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  z-index: 99;
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderBox = styled.div`
  position: relative;
  padding-left: 0px;
  padding-right: 0px;
  display: flex;
  flex-direction: column;
  height: 300px;
`;

const SliderBoxTitle = styled.h1`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 25px;
  padding-left: 50px;
`;

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderButton = styled.div`
  display: flex;
  height: 100%;
  width: 10%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 45px;
  padding-right: 10px;
  opacity: 0;
  font-size: 30px;
  font-weight: 800;
  :hover {
    opacity: 1;
    cursor: pointer;
    z-index: 99;
  }
`;

const rowVariants: Variants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
    transition: {
      type: "tween",
    },
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const bigMovieMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popular, isLoading: isLoadingPopular } =
    useQuery<IGetPopularResult>(["movies", "popluar"], getPopularMovies);
  const [index, setIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [popularLeaving, setPopularLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increasePopularIndex = () => {
    if (popular) {
      if (popularLeaving) return;
      togglePopularLeaving();
      const totalMovies = popular?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const togglePopularLeaving = () => setPopularLeaving((prev) => !prev);
  const onBoxClicked = (movideId: number) => {
    navigate(`/movies/${movideId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    ) ||
      popular?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      ));
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderBox>
            <SliderBoxTitle>Now Playing</SliderBoxTitle>
            <SliderContainer>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={index}
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {data?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "now"}
                          key={movie.id + "now"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </SliderContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <SliderButton onClick={increaseIndex}>→</SliderButton>
            </div>
          </SliderBox>

          <SliderBox>
            <SliderBoxTitle>Popular</SliderBoxTitle>
            <SliderContainer>
              <Slider>
                <AnimatePresence
                  initial={false}
                  onExitComplete={togglePopularLeaving}
                >
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={popularIndex}
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {popular?.results
                      .slice(
                        offset * popularIndex,
                        offset * popularIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "popular"}
                          key={movie.id + "popular"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </SliderContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <SliderButton onClick={increasePopularIndex}>→</SliderButton>
            </div>
          </SliderBox>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
