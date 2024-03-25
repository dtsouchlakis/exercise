import Fade from "@mui/material/Fade";
import ForestIcon from "@mui/icons-material/Forest";

export default function Forest() {
  return (
    <>
      <div
        className="flex flex-col w-40 border-b-2 border-red-700"
        aria-label="forest animation"
      >
        <div className="flex flex-row justify-center -mb-8 text-lime-700 ">
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={4000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={3000}>
            <ForestIcon fontSize="large" />
          </Fade>
        </div>
        <div className="flex flex-row justify-center -mb-6 text-lime-600">
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={4000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={2000}>
            <ForestIcon fontSize="large" />
          </Fade>
        </div>
        <div className="flex flex-row justify-center text-lime-500">
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={3000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={2000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={2000}>
            <ForestIcon fontSize="large" />
          </Fade>
        </div>
        <div className="flex flex-row justify-center -mt-6 text-lime-400">
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={3000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={1000}>
            <ForestIcon fontSize="large" />
          </Fade>
          <Fade in={true} appeared={"true"} timeout={2000}>
            <ForestIcon fontSize="large" />
          </Fade>
        </div>
      </div>
    </>
  );
}
