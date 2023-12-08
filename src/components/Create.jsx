import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function Create({ addRecord, onClose }) {
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
            description: e.target.title.value,
            history: [
              {
                money: +e.target.money.value,
                date:
                  new Date().toDateString() +
                  " " +
                  new Date().toTimeString().split(" G")?.[0],
                description: e.target.description.value,
              },
            ],
          });
          onClose();
        }}
      >
        <input type="text" name="money" placeholder="money" />
        <input type="text" name="title" placeholder="title" />
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
