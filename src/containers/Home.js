import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { BsPencilSquare } from "react-icons/bs";

export default function Home() {
  const [musicSheet, setMusicSheet] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const musicSheet = await loadMusicSheet();
        setMusicSheet(musicSheet);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadMusicSheet() {
    return API.get("mymusicsheetrepo-api", "/musicsheet");
  }

  // function loadMusicSheet() {
  //   return API.get("mymusicsheetrepo-api", "/invalid_path");
  // }

  function renderMusicSheetList(musicSheet) {
    <>
        <LinkContainer to="/musicsheet/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new music sheet</span>
          </ListGroup.Item>
        </LinkContainer>
        {musicSheet.map(({musicsheetId, content, createdAt }) => (
          <LinkContainer key={musicsheetId} to={'/musicsheet/${musicsheetId}'}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>My Music Sheet Repo</h1>
        <p className="text-muted">Store and access your music sheet online!</p>
      </div>
    );
  }

  function renderMusicSheet() {
    return (
      <div className="music-sheet">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your music sheet</h2>
        <ListGroup>{!isLoading && renderMusicSheetList(musicSheet)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderMusicSheet() : renderLander()}
      {/* { isAuthenticated.none.no } */}
    </div>
  );
}