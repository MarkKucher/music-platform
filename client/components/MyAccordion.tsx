import React, {useState} from "react";
import {IconButton} from "@mui/material";
import ExpandLessSharpIcon from '@mui/icons-material/ExpandLessSharp';
import {useSpring, animated} from "react-spring";

function Accordion(props) {
    const [open, setOpen] = useState(false);

    let toggleHandler = () => {
        setOpen(!open);
    };

    const styles = {
        accordionTitle: {
            color: open ? "#fff" : "#5f5e5e"
        },
        accordionContent: {
            margin: '5px',
            padding: '2px'
        },
        accordionText: {
            background: '#ededee',
            overflowX: 'auto'
        }
    };

    const openAnimation = useSpring({
        from: { opacity: 0, maxHeight: 0 },
        to: { opacity: open ? 1 : 0, maxHeight: open ? "fit-content" : 0, ...styles.accordionText },
        config: { duration: 300 }
    });

    const iconAnimation = useSpring({
        from: {
            opacity: 1,
            transform: "rotate(0deg)",
            color: "#fff"
        },
        to: {
            opacity: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: open ? "#5f5e5e" : "#000000"
        },
        config: { duration: 120 }
    });

    return (
        <animated.div className="accordion__item">
            <div className="accordion__header" onClick={toggleHandler}>
                <h4 style={styles.accordionTitle}>{props.title}</h4>
                <animated.i style={iconAnimation}>
                    <IconButton>
                        <ExpandLessSharpIcon/>
                    </IconButton>
                </animated.i>
            </div>
            <animated.div style={openAnimation}>
                <pre className="accordion__text">
                    {props.text}
                </pre>
            </animated.div>
            <style jsx>
                {
                    `
                      * {
  margin: 0;
  padding: 2px;
  background-color:  #c6c6c5;
}

.accordion__text {
  width: fit-content;
  background: #ededee;
}

.main {
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  flex-direction: column;
  row-gap: 20px;
}

h1 {
  margin: 10px;
  font-size: 40px;
  color: rgb(255, 255, 255);
}

.accordion {
  margin: 30px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.accordion__item {
  width: 40%;
  padding: 17px 10px;
  border-bottom: 1px solid #c9c9c9;
  color: #fff;
  overflow: hidden;
  cursor: pointer;
}

.accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accordion__header h4 {
  transition: 0.2s ease-in-out;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 10px;
}

.accordion__header i {
  transition: 0.2s ease-in-out;
  transform-origin: center;
  margin-bottom: 10px;
}

.accordion__header:hover h4 {
  color:  #2a73af!important;
}

.accordion__header:hover i {
  color:  #2a73af;
}

.accordion__content {
  margin: 5px;
}

@media (max-width:600px) {
  h1 {
    font-size: 30px;
  }
  .accordion__item {
    width: 80%;
  }
}
                    `
                }
            </style>
        </animated.div>
    );
}

export default Accordion;
