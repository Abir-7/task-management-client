import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { changeStatus } from "../../Redux/feature/taskProgress/taskProgressSlice";

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-box1">
        <h1>On Goning Project</h1>

        <div className="task-description2">
          <h3>Name</h3>
          <h3>Description</h3>
          <div className="description2">
            <p>
       
              description: Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Exercitationem rerum est, fugit magni iusto saepe officiis
              optio repellendus nesciunt et, quaerat quia nulla at ad amet esse
              assumenda voluptatibus! description: Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Exercitationem rerum est, fugit
              magni iusto saepe officiis optio repellendus nesciunt et, quaerat
              quia nulla at ad amet esse assumenda voluptatibus!
              description: Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Exercitationem rerum est, fugit magni iusto saepe officiis
              optio repellendus nesciunt et, quaerat quia nulla at ad amet esse
              assumenda voluptatibus! description: Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Exercitationem rerum est, fugit
              magni iusto saepe officiis optio repellendus nesciunt et, quaerat
              quia nulla at ad amet esse assumenda voluptatibus!
            </p>
          </div>
          <div className="time">
            <h4>date</h4> <div>Link</div>
          </div>
        </div> 
 
      </div>

      <div className="homepage-box2">
        <h1>Completed Project</h1>

        <div className="task-description2">
          <h3>Name</h3>
          <h3>Description</h3>
          <div className="description2">
            <p>
       
              description: Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Exercitationem rerum est, fugit magni iusto saepe officiis
              optio repellendus nesciunt et, quaerat quia nulla at ad amet esse
              assumenda voluptatibus! description: Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Exercitationem rerum est, fugit
              magni iusto saepe officiis optio repellendus nesciunt et, quaerat
              quia nulla at ad amet esse assumenda voluptatibus!
              description: Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Exercitationem rerum est, fugit magni iusto saepe officiis
              optio repellendus nesciunt et, quaerat quia nulla at ad amet esse
              assumenda voluptatibus! description: Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Exercitationem rerum est, fugit
              magni iusto saepe officiis optio repellendus nesciunt et, quaerat
              quia nulla at ad amet esse assumenda voluptatibus!
            </p>
          </div>
          <div className="time">
            <h4>date</h4> <div>Link</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
