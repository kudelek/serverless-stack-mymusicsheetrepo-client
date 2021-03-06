import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API, Storage } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./MusicSheet.css";

export default function MusicSheet() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [musicsheet, setMusicSheet] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModalFile, setShowModalFile] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const handleCloseModalFile = () => setShowModalFile(false);
  // eslint-disable-next-line no-unused-vars
  const handleShowModalFile = () => setShowModalFile(true);
  const handleCloseModalDelete = () => setShowModalDelete(false);
  // eslint-disable-next-line no-unused-vars
  const handleShowModalDelete = () => setShowModalDelete(true);

  useEffect(() => {
    function loadMusicSheet() {
      return API.get("mymusicsheetrepo-api", `/mymusicsheetrepo/${id}`);
    }

    async function onLoad() {
      try {
        const musicsheet = await loadMusicSheet();
        const { content, attachment } = musicsheet;

        if (attachment) {
            musicsheet.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setMusicSheet(musicsheet);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  function saveMusicSheet(musicsheet) {
    return API.put("mymusicsheetrepo-api", `/mymusicsheetrepo/${id}`, {
      body: musicsheet
    });
  }
  
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      setShowModalFile(true);
      if (showModalFile === false)
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveMusicSheet({
        content,
        attachment: attachment || musicsheet.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteMusicSheet() {
    return API.del("mymusicsheetrepo-api", `/mymusicsheetrepo/${id}`);
  }
  
  function handleModalDelete() {
    setShowModalDelete(true);
    if (!showModalDelete)
      return;
    handleDelete();
  }

  async function handleDelete() {
  
    setIsDeleting(true);
  
    try {
      setShowModalDelete(false);
      await deleteMusicSheet();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }

  }

  function ModalFile(props) {
    return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>Exceeded maximum file size: {config.MAX_ATTACHMENT_SIZE/1000000}MB</Modal.Body>
      <Modal.Footer>
        <Button variant="custom" onClick={handleCloseModalFile}>Understood</Button>
      </Modal.Footer>
    </Modal>
    )
  }

  function ModalDelete(props) {
    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this entry?</Modal.Body>
        <Modal.Footer>
          <Button variant="custom-del" onClick={handleModalDelete}>Yes</Button>
          <Button variant="custom" onClick={handleCloseModalDelete}>No</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div className="MusicSheet">
      {musicsheet && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {musicsheet.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={musicsheet.attachmentURL}
                >
                  {formatFilename(musicsheet.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            variant="custom"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="custom-del"
            onClick={handleModalDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>

              <ModalFile show={showModalFile} onHide={handleCloseModalFile}/>
              <ModalDelete show={showModalDelete} onHide={handleCloseModalDelete}/>
        </Form>
      )}
    </div>
  );
}