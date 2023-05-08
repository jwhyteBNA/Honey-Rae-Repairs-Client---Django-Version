import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { TicketCard } from "./TicketCard"
import { getAllTickets, searchTicketsByStatus, searchTickets } from "../../managers/TicketManager"
import "./Tickets.css"

export const TicketList = () => {
  const [active, setActive] = useState("")
  const [tickets, setTickets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllTickets().then((res) => setTickets(res))
  }, [])

  useEffect(() => {
    const activeTicketCount = tickets.filter(t => t.date_completed === null).length
    if (isStaff()) {
      setActive(`There are ${activeTicketCount} open tickets`)
    }
    else {
      setActive(`You have ${activeTicketCount} open tickets`)
    }
  }, [tickets])

  const toShowOrNotToShowTheButton = () => {
    if (isStaff()) {
      return ""
    }
    else {
      return <button className="actions__create"
        onClick={() => navigate("/tickets/create")}>Create Ticket</button>
    }
  }

  const filterTickets = (status) => {
    searchTicketsByStatus(status).then((res) => setTickets(res))
  }

  const filterSearchTickets = (searched_term) => {
    searchTickets(searched_term).then((res) => setTickets(res))
  }

  return <>
    <div>
      <button onClick={() => filterTickets("done")}>Show Done</button>
      <button onClick={() => filterTickets("all")}>Show All</button>
      <button onClick={() => filterTickets("unclaimed")}>Unclaimed</button>
      <button onClick={() => filterTickets("inprogress")}>In Progress</button>
    </div>
    <div className="actions">{toShowOrNotToShowTheButton()}</div>
    <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input is-primary" type="text" placeholder="Search" onChange={
            (event) => {
              filterSearchTickets(event.target.value)
            }
          } />
        </p>
      </div>
    <div className="activeTickets">{active}</div>
    <article className="tickets">
      {
        tickets.map(ticket => (
          <TicketCard key={`ticket--${ticket.id}`} ticket={ticket} />
        ))
      }
    </article>
  </>
}
