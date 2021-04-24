import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Home() {
  const [musicsheet, setMusicSheet] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [ isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      if (!isLoading) {
        return;
      }
  
      try {
        const musicsheet = await loadMusicSheet();
        setMusicSheet(musicsheet);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.put("musicsheet", "/musicsheet");
  }

  function renderMusicSheetList(musicsheet) {
    return (
    <div>
        <LinkContainer to="/mymusicsheetrepo/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsMusicNoteBeamed size={20} />
            <span className="ml-2 font-weight-bold">Create a new entry</span>
          </ListGroup.Item>
        </LinkContainer>
        {musicsheet.map(({musicsheetId, content, createdAt }) => (
          <LinkContainer key={musicsheetId} to={`/mymusicsheetrepo/${musicsheetId}`}>
            <ListGroup.Item action>
              <div className="text-fade">
                <span className="font-weight-bold">
                  {content.trim().split("\n")[0]}
                </span>
                <br />
                <span className="text-muted">
                  Created: {new Date(createdAt).toLocaleString()}
                </span>
              </div>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </div>);
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>My Music Sheet Repo</h1>
        <p className="text-muted">Store and access your music sheet online!</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info bin-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-md ml-3">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderMusicSheet() {
    return (
      <div className="music-sheet">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your music sheet</h2>
        <ListGroup>{renderMusicSheetList(musicsheet)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderMusicSheet() : renderLander()}
    </div>
  );
}