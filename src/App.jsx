import { useEffect, useState, useRef } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronUp,
  FaCross,
  FaPlus,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import { FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
function App() {
  const [payments, setPayments] = useState(
    JSON.parse(localStorage.getItem("payments")) || [
      { key: 0, type: "other", money: 2830, description: "Initial Money" },
      {
        key: 1,
        type: "invest",
        profit: -175,
        invested: 535,
        name: "Semines",
        link: "https://www.siemensh5.com/#/",
        history: [],
      },
      {
        key: 2,
        type: "invest",
        profit: 722,
        invested: 550,
        name: "Candian Solari",
        link: "https://www.canadiansolari.com/index",
        history: [],
      },
      {
        key: 3,
        type: "invest",
        profit: 800,
        invested: 1600,
        name: "Candian Solari",
        link: "https://www.canadiansolari.com/index",
        history: [],
      },
      {
        key: 4,
        type: "invest",
        profit: -210,
        invested: 480,
        name: "Anc Mining",
        link: "https://ancmining.cc",
        history: [{ money: 270 }],
      },
      {
        key: 5,
        type: "invest",
        profit: -2096,
        invested: 2400,
        name: "Splyt",
        link: "https://www.splytrent.co",
        history: [{ money: 152 }, { money: 152 }],
      },
      { key: 6, type: "other", money: 2000, description: "money added" },
    ]
  );
  const [create, setCreate] = useState(false);
  const [selected, setSelected] = useState(0);
  const [opened, setOpened] = useState(0);
  const [add, setAdd] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (selected != -1) inputRef.current?.focus();
  }, [selected]);
  useEffect(() => {
    setTotal(() => {
      let t = 0;
      payments
        .filter((p) => p.type == "invest")
        .forEach((p) => (t += p.profit));
      payments.filter((p) => p.type == "other").forEach((p) => (t += p.money));
      return t;
    });
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  function handleFormSubmit(e, p_index) {
    e.preventDefault();
    let d = new Date();
    payments[p_index].profit += +add;
    payments[p_index].history.push({
      money: +add,
      date: d.toDateString() + " " + d.toTimeString().split(" G")?.[0],
    });
    setPayments([...payments]);
    setSelected(-1);
    setAdd("");
  }
  function onPlusClick(e, p_index) {
    if (selected != p_index) {
      setSelected(p_index);
    } else {
      if (!add) {
        setSelected(-1);
      } else {
        payments[p_index].profit += +add;
        let d = new Date();
        payments[p_index].history.push({
          money: +add,
          date: d.toDateString() + " " + d.toTimeString().split(" G")?.[0],
        });
        setPayments([...payments]);
        setAdd("");
        setSelected(-1);
      }
    }
  }
  function addRecord(record, history) {
    setPayments((p) => [...p, record]);
  }

  function handleOpened(p_index) {
    if (opened == p_index) setOpened(-1);
    else setOpened(p_index);
  }

  const [total, setTotal] = useState(0);
  return (
    <div className="payments">
      {payments.map((payment, p_index) => {
        if (payment.type == "invest") {
          return (
            <>
              <div className="payment" key={p_index}>
                <p
                  className={"profit " + (payment.profit < 0 ? "neg" : "pos")}
                  onClick={() => handleOpened(p_index)}
                >
                  {payment.profit}
                </p>
                <p className="invested">{payment.invested}</p>
                <FiPlus
                  className="add-btn"
                  onClick={(e) => onPlusClick(e, p_index)}
                />
                {selected == p_index ? (
                  <form
                    action=""
                    onSubmit={(e) => handleFormSubmit(e, p_index)}
                  >
                    <input
                      type="text"
                      value={add}
                      ref={inputRef}
                      onChange={(e) => setAdd(e.target.value)}
                      name="add"
                      autoSave={false}
                      autoComplete={false}
                    />
                  </form>
                ) : (
                  <>
                    <p
                      className="description"
                      onClick={() => open(payment.link)}
                    >
                      {payment.name}
                    </p>
                  </>
                )}
              </div>
              {opened == p_index && payment.history.length > 0 && (
                <div className="data">
                  <p id="history-head">History: </p>
                  <div className="history">
                    {payment.history.map((h, h_index) => {
                      return (
                        <div
                          className="history-item"
                          key={p_index + "x" + h_index}
                        >
                          <p className="history-money">{h.money}</p>
                          <p className="history-date">{h?.date}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-got">
                    <div className="text">Total: </div>
                    <div className="value">
                      {payment.invested + payment.profit}
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        } else if (payment.type == "other") {
          return (
            <div className="other payment" key={p_index}>
              <p className="money">{payment.money}</p>
              <p className="description">{payment.description}</p>
            </div>
          );
        }
      })}

      {create && (
        <Create addRecord={addRecord} onClose={() => setCreate(false)} />
      )}

      <p className="total">
        Total:
        <span className="total-value">{total}</span>
        {!create && (
          <div className="add-btn-outer">
            <FiPlus className="add-btn" onClick={(e) => setCreate(true)} />
          </div>
        )}
      </p>

      <div
        className="download-btn"
        onClick={() => {
          let file = new Blob([JSON.stringify(payments, null, 4)], {
            type: "application/json",
          });
          saveAs(file, "payments");
        }}
      >
        download
      </div>
      <input
        type="file"
        onChange={(e) => {
          let file = e.target.files[0];
          if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => {
              console.log(event.target.result);
              setPayments(JSON.parse(event.target.result));
            };
          }
        }}
      />
    </div>
  );
}

function Create({ addRecord, onClose }) {
  const [type, setType] = useState("invxest");
  const [invest, setInvest] = useState("");
  const [profit, setProfit] = useState("");

  useEffect(() => {
    setProfit(-1 * invest || "");
  }, [invest]);

  const Buttons = (
    <div className="btns">
      <div className="left">
        <FaChevronLeft onClick={(e) => setType("x")} />
        <MdClose onClick={onClose} />
      </div>
      <div className="right">
        <button className="submit">Submit</button>
      </div>
    </div>
  );

  if (type == "invest")
    return (
      <form
        className="create"
        onSubmit={(e) => {
          e.preventDefault();
          addRecord({
            type: "invest",
            profit,
            invested: +invest,
            name: e.target.name.value,
            link: e.target.link.value,
            history: [],
          });
          onClose();
        }}
      >
        <input
          type="text"
          placeholder="invest"
          value={invest}
          onChange={(e) => setInvest(e.target.value)}
        />
        <input
          type="text"
          placeholder="profit"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
        />
        <input type="text" placeholder="name" name="name" />
        <input type="text" placeholder="link" name="link" />
        {Buttons}
      </form>
    );
  else if (type == "money")
    return (
      <form
        action=""
        className="create"
        onSubmit={(e) => {
          e.preventDefault();
          addRecord({
            type: "other",
            money: +e.target.money.value,
            description: e.target.description.value,
          });
          onClose();
        }}
      >
        <input type="text" name="money" placeholder="money" />
        <input type="text" name="description" placeholder="description" />
        {Buttons}
      </form>
    );
  else
    return (
      <div className="create">
        <button onClick={() => setType("invest")}>Invest</button>
        <button onClick={() => setType("money")}>Add Money</button>
        <div className="btns">
          <div className="left">
            <MdClose onClick={onClose} />
          </div>
        </div>
      </div>
    );
}

export default App;
