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
import Create from "./components/Create";
function App() {
  const [payments, setPayments] = useState(
    JSON.parse(localStorage.getItem("payments")) || [
      {
        key: 0,
        type: "other",
        money: 2830,
        description: "Initial Money",
        history: [
          { money: 2830, date: "testing", description: "Initial Money" },
        ],
      },
      {
        key: 1,
        type: "invest",
        profit: -197,
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
  const [opened, setOpened] = useState(-1);
  const [openAddMoney, setOpenAddMoney] = useState(-1);
  const [add, setAdd] = useState("");
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
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
      setOpenAddMoney(-1);
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
  function onAddMoneyPlusClick(e, p_index) {
    if (openAddMoney != p_index) {
      setOpenAddMoney(p_index);
      setSelected(-1);
    } else {
      setOpenAddMoney(-1);
    }
  }

  function onExport() {
    let file = new Blob([JSON.stringify(payments, null, 4)], {
      type: "application/json",
    });
    saveAs(file, "payments");
  }
  function onImport(e) {
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        console.log(event.target.result);
        setPayments(JSON.parse(event.target.result));
      };
    }
  }
  function onAddMoneySubmit(e, p_index) {
    e.preventDefault();
    const d = new Date();
    payments[p_index].history.push({
      money: +e.target.money.value,
      date: d.toDateString() + " " + d.toTimeString().split(" G")?.[0],
      description: e.target.description.value,
    });
    payments[p_index].money += +e.target.money.value;
    setPayments(() => [...payments]);
    setOpenAddMoney(-1);
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
              {opened == p_index && payment.history.length >= 0 && (
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
            <div className="other add-money-div " key={p_index}>
              <div className="payment">
                <p className="money" onClick={() => handleOpened(p_index)}>
                  {payment.money}
                </p>
                <p className="description">{payment.description}</p>
                <FiPlus
                  className="add-btn"
                  onClick={(e) => onAddMoneyPlusClick(e, p_index)}
                />
              </div>
              {openAddMoney == p_index && (
                <form
                  className="add-money-body"
                  onSubmit={(e) => onAddMoneySubmit(e, p_index)}
                >
                  <input
                    type="text"
                    name="description"
                    placeholder="description"
                  />
                  <div className="row">
                    <input type="text" name="money" placeholder="Money" />{" "}
                    <button type="submit">Submit</button>
                  </div>
                </form>
              )}
              {opened == p_index && (
                <div className="data">
                  <div className="history">
                    {payments[p_index].history.map((h, h_ind) => {
                      return (
                        <div
                          className="history-item"
                          key={p_index + "x" + h_ind}
                        >
                          <p className="history-money">{h.money}</p>
                          <p className="history-date">{h?.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

      <div className="end-btns">
        <button className="download-btn" onClick={(e) => onExport()}>
          Export
        </button>
        <button onClick={(e) => fileInputRef.current.click()}>Import</button>
      </div>
      <input
        type="file"
        onChange={(e) => onImport(e)}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
}

export default App;
