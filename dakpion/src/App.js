import Gun from "gun";
import { useEffect, useReducer, useState } from "react";

const gun = Gun({
  peers: ["http://localhost:3030/gun"],
});

const initialState = {
  messages: [],
};

function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  };
}

export default function App() {
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get("messages");
    messages.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  function onChange(e) {
    setForm({
      ...formState,
      [e.target.name]: e.target.value,
    });
  }

  function saveMessage() {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: new Date().toDateString(),
    });
    setForm({
      name: "",
      message: "",
    });
  }

  return (
    <div>
      <h1>Welcome to Dakpion</h1>
      <input
        type="text"
        name="name"
        placeholder="Enter Your Name"
        value={formState.name}
        onChange={onChange}
      />
      <input
        type="text"
        name="message"
        placeholder="Enter Your Message"
        value={formState.message}
        onChange={onChange}
      />
      <button onClick={saveMessage}>Send Message</button>
      {state.messages.map((message) => (
        <div key={message.index} id={message.index}>
          <h3>{message.name}</h3>
          <p>{message.message}</p>
          <span>{message.createdAt}</span>
        </div>
      ))}
    </div>
  );
}

// export default function App() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const gunMessage = gun.get('messages');
//     gunMessage.map().on(messages => {
//       dispatch(messages);
//     });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     gun.get('messages').set({
//       message: message,
//       timestamp: new Date().toISOString()
//     });
//     setMessage('');
//   };

//   return (
//     <div className="App">
//       <h1>Gun Chat</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//         />
//         <button type="submit">Send</button>
//       </form>
//       <ul>
//         {state.messages.map(message => (
//           <li key={message.timestamp}>
//             {message.message}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
