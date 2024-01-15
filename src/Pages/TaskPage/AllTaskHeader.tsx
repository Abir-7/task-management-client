

function AllTaskHeader({statusName,length}:{statusName:string,length:number}) {
  return (
    <div className="all-task-status-box">
    <p>{statusName}</p>
    <p className="total-task">{length}</p>
  </div>
  )
}

export default AllTaskHeader