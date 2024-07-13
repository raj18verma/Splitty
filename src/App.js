import React, { useEffect, useState } from "react"
import "./index.css"

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
]

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  )
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  useEffect(() => {
    console.log("friends", friends)
  }, [friends])

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleDeleteFriend(id) {
    setFriends((friends) => friends.filter((friend) => friend.id !== id))
  }

  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(bill, whoIsPaying) {
    const perPersonShare = bill / (friends.length + 1)

    console.log(whoIsPaying)

    if (whoIsPaying == "user") {
      setFriends((friends) =>
        friends.map((friend) => ({
          ...friend,
          balance: friend.balance + perPersonShare,
        }))
      )
    } else {
      setFriends((friends) =>
        friends.map((friend) => {
          if (friend.id == whoIsPaying) {
            return {
              ...friend,
              balance: friend.balance - perPersonShare,
            }
          }
          return friend
        })
      )
    }

    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
          onDelete={handleDeleteFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      <FormSplitBill onSplitBill={handleSplitBill} friends={friends} />
    </div>
  )
}

function FriendsList({ friends, onSelection, selectedFriend, onDelete }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelection, selectedFriend, onDelete }) {
  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
      <Button onClick={() => onDelete(friend.id)}>Delete</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return

    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFriend)

    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>
        <span role="img" aria-label="friends">
          🧑‍🤝‍🧑
        </span>{" "}
        Friend name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ onSplitBill, friends }) {
  const [bill, setBill] = useState("")
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmit(e) {
    e.preventDefault()
    const billValue = Number(bill)

    if (!billValue) return

    onSplitBill(billValue, whoIsPaying)
  }
  useEffect(() => {
    console.log(whoIsPaying)
  }, [whoIsPaying])

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill among friends</h2>

      <label>
        <span role="img" aria-label="money">
          💰
        </span>{" "}
        Bill value
      </label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>
        <span role="img" aria-label="money-face">
          🤑
        </span>{" "}
        Who is paying the bill
      </label>
      <select
        value={whoIsPaying}
        onChange={(e) => {
          setWhoIsPaying(e.target.value)
        }}
      >
        <option value="user">You</option>
        {friends.map((friend) => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}
