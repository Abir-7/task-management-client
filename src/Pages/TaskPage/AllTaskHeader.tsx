

function AllTaskHeader({statusName}:{statusName:string}) {
  return (
    <div className="all-task-status-box">
    <p>{statusName}</p>
    <p className="total-task">2</p>
  </div>
  )
}

export default AllTaskHeader