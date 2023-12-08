import "../shelter-information.css";
import { baseURL } from "../../../urlConfig";

export function CommentBox(comment) {
    return (
      <div className="shelter-comment-box">
        <p style={{margin: 0}}>
            <strong>{comment.commenter.username}</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {comment.creation_time}
            </p>
        <p style={{margin: 0}}>{comment.content}</p>
      </div>
    );
  }