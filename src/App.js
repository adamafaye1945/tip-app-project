import { useState } from "react";

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
];
function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [displayForm, setDisplayForm] = useState(false);
  const [current_id, set_current_id] = useState(null);

  function handleSplitId(id) {
    set_current_id((current_id) => id);
  }
  function handleDisplay() {
    setDisplayForm(!displayForm);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} handleSplitId={handleSplitId} />
        {displayForm ? (
          <>
            <FormAddFriend setFriends={setFriends} />
            <Button functionality={handleDisplay}>Close</Button>
          </>
        ) : (
          <Button functionality={handleDisplay}>Add Friend</Button>
        )}
      </div>
      <div>
        {current_id && (
          <SplitBill
            friends={friends}
            current_id={current_id}
            set_current_id={set_current_id}
            setFriends={setFriends}
          />
        )}
      </div>
    </div>
  );
}

function Button({ children, functionality }) {
  return (
    <button className="button" onClick={functionality}>
      {children}
    </button>
  );
}

function Friend({ friend, handleSplitId }) {
  return (
    <li>
      <img src={friend.image} alt="random" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p style={{ color: "red" }}>
          you owns {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p style={{ color: "green" }}>
          {friend.name} owns you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>{friend.name} and you are even</p>}

      <Button functionality={() => handleSplitId(friend.id)}>Select</Button>
    </li>
  );
}

function FormAddFriend({ children, setFriends }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !imageUrl) {
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      balance: 0,
      image: `${imageUrl}?=${id}`,
    };
    setFriends((friends) => [...friends, newFriend]);
    setName("");
    setImageUrl("https://i.pravatar.cc/48");
    console.log(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♀️ Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🌆 image url</label>
      <input
        value={imageUrl}
        type="text"
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}
function FriendList({ friends, handleSplitId }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            handleSplitId={handleSplitId}
          />
        ))}
      </ul>
    </>
  );
}
function SplitBill({ set_current_id, friends, current_id, setFriends }) {
  const [bill, setBill] = useState(null);
  const [userExpense, setUserExpense] = useState(null);
  const [friendExpense, setFriendExpense] = useState(null);
  const [payer, setPayer] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    let the_payer = payer === "1" ? "user" : "friend";
    let balance = 0;
    if (userExpense + friendExpense !== bill) {
      window.confirm("you can't pay more or less than the bill");
      return (
        <SplitBill
          friends={friends}
          current_id={current_id}
          set_current_id={set_current_id}
          setFriends={setFriends}
        />
      );
    }
    if (the_payer === "user") {
      balance = bill - userExpense;
    } else {
      balance = friendExpense - bill;
    }
    console.log(balance);
    const newfriends = [...friends];
    newfriends[i].balance = balance;
    setFriends(newfriends);
    set_current_id(null);
  }
  let i;
  for (i = 0; i < friends.length; i++) {
    if (friends[i].id === current_id) {
      break;
    }
  }
  let friend = friends[i];
  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>SPLIT A BILL WITH {friend.name} </h2>

        <label>💰 Bill value</label>
        <input
          type="text "
          value={bill}
          onChange={(e) => setBill((bill) => Number(e.target.value))}
        />

        <label>🧍‍♂️ Your expense</label>
        {!bill ? (
          <input type="text" disabled />
        ) : (
          <input
            type="text"
            value={userExpense}
            onChange={(e) =>
              setUserExpense((userExpense) => Number(e.target.value))
            }
          />
        )}

        <label>👯‍♀️ {friend.name}'s expense</label>

        {!userExpense ? (
          <input type="text" disabled />
        ) : (
          <input
            type="text"
            value={friendExpense}
            onChange={(e) =>
              setFriendExpense((friendExpense) => Number(e.target.value))
            }
          />
        )}
        <label>🤑 Who is paying for the bill</label>
        <select onChange={(e) => setPayer(e.target.value)}>
          <option value={0}>Friend</option>
          <option value={1}>You</option>
        </select>
        <Button>Split bill</Button>
      </form>
    </>
  );
}

export default App;
