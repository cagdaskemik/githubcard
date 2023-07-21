const widgetStyle = `
h1, div, p {
  margin: 0px;
  padding: 0px;
  font-family: 'system-ui';
}
a {
  text-decoration: none;
  color: inherit;
}
#github-logo {
  height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.cover {
  height: 120px;
  width: 100%;
  background: linear-gradient(to bottom, #770041, #f6f8fa); /* changed to gradient background */
  position: absolute;
  left: 0px;
  top: 0px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 3;
}

.card {
  position: relative;
  display: inline-block;
  background: #f6f8fa; /* changed background color */
  border-radius: 5px;
  box-shadow: 0 12px 13px rgba(0, 0, 0, 0.16), 0 12px 13px rgba(0, 0, 0, 0.16);
  text-align: center;
  padding: 20px 50px;
  margin: 5px;
  padding-top: 85px; /* adjusted padding to accommodate image change */
  transition: all 0.5s;

}
.card-wrapper {

}



/* Dark Theme */
.card.dark {
  background: #1C1D21;
}
.dark .card-title {
  color: #E4E4E4 !important;
  font-weight: 500 !important;
}
.dark .card-desc {
  font-weight: 400 !important;
  color: #c6c6c6 !important;
} 
.dark .count {
  color: #c6c6c6 !important;
  font-weight: 600 !important;
} 
.dark .box-text {
  color: #797979 !important;
  font-weight: 500 !important;
}
.dark .footer-box {
  background: #1D2025 !important;
  box-shadow: 0px 0.2px 5px rgba(255, 255, 255, 0.15), 0px 4px 10px rgba(0, 0, 0, 0.25) !important;
}

.card .fa-github {
  position: absolute;
  color: #646464;
  font-size: 20px;
  top: 10px;
  right: 10px;
}
.card .card-title {
  color: #434343;
  margin-bottom: -8px;
  font-size: 25px;
  font-weight: 600;
}
.card .card-responsename {
  margin-bottom: 20px;
  color: #797979;
}
.card .card-desc {
  font-weight: 500;
  width: 250px;
  margin: auto;
  display: block;
  color: #3c3c3c;
}
.card .card-img-wrapper {
    position: relative;
    height: 145px; /* adjusted size */
    width: 145px; /* adjusted size */
    margin: -72.5px auto 30px; /* adjusted margin to make image at the boundary of cover and card */
    z-index: 4;
  }
  

  
.card .card-img-wrapper img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  margin-top: 30px;
  z-index: 5;
}
.card .card-img-wrapper::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 28px;
  height: 100%;
  border-radius: 100%;
  border: 2px solid #0d1117;
  z-index: 1;
}

.card .card-footer {
  margin-top: 40px;
}
.card .card-footer .footer-box {
    position: relative;
    border-bottom: 2px solid #770041;
    box-shadow: 0 7px 6px -1px rgba(119, 0, 65, 0.5), 0 -2px 4px -1px rgba(119, 0, 65, 0.5); /* moved shadow to bottom and changed color */
    border-radius: 5px;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    justify-content: space-around;
  }
  
.card .card-footer .footer-box .box-wrapper {
  position: relative;
}
.card .card-footer .footer-box .box-wrapper .count {
  font-family: 'consolas';
  color: #434343;
  font-size: 20px;
  font-weight: 600;
}
.card .card-footer .footer-box .box-wrapper .box-text {
  font-size: 12px;
  font-weight: 600;
  color: #00000085;
  letter-spacing: 0.5px;
}
`;
// CSS Styling for the widget

// Function to format numbers into a readable format (K, Mil, Bil, Tril)
function formatNumbers(num) {
  if (!(num >= 1000)) return num;
  let newNum = num;
  let increment = 0;
  while (newNum >= 1000) {
    newNum /= 1000;
    increment += 1;
  }
  newNum = newNum.toPrecision(3);
  newNum += ["", "K", "M", "B", "T"][increment];
  return newNum;
}

// Create a template element and set its innerHTML
const template = document.createElement("template");
template.innerHTML = `
    <style>
        ${widgetStyle}
    </style>
    <div class="card"></div>
`;

class GithubProfile extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["theme", "color", "color-secondary"];
    }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "theme" && oldValue !== newValue && newValue !== "") {
      this.setTheme(newValue);
    }
    if (name === "color" && oldValue !== newValue && newValue !== "") {
      this.setColor(newValue);
    }
    if (name === "color-secondary" && oldValue !== newValue && newValue !== "") {
      this.setSecondaryColor(newValue);
    }
  }

  setSecondaryColor(color) {
    const cover = this._shadowRoot.querySelector(".cover");
    if (cover) {
      const gradient = `linear-gradient(to bottom, ${this.getColor()}, ${color})`;
      cover.style.background = gradient;
    }
  }

  async connectedCallback() {

    // Rest of the code inside connectedCallback
    // ...

    await this.fetchData(this.getAttribute("user")).then((data) => {
      this.createCard(data);
    });

    const theme = this.getAttribute("theme");
    if (theme) {
      this.setTheme(theme);
    }

    const color = this.getAttribute("color");
    if (color) {
      this.setColor(color);
    }

    const secondaryColor = this.getAttribute("color-secondary");
    if (secondaryColor) {
      this.setSecondaryColor(secondaryColor);
    }
  }

  setTheme(theme) {
    const card = this._shadowRoot.querySelector(".card");
    if (theme === "dark") {
      card.classList.add("dark");
    } else {
      card.classList.remove("dark");
    }
  }

  setColor(color) {
    this.color = color;
    const cover = this._shadowRoot.querySelector(".cover");
    const footerBox = this._shadowRoot.querySelector(".footer-box");
    if (cover) {
      cover.style.background = color;
    }
    if (footerBox) {
      footerBox.style.borderColor = color;
      footerBox.style.boxShadow = `0 7px 6px -1px ${color}, 0 -2px 4px -1px ${color}`;
    }
  }
  async fetchData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`, { method: "GET" });
    return await response.json();
  }
  getColor() {
    return this.color || "#f6f8fa"; // Default color if not set
  }

  getSecondaryColor() {
    return this.getAttribute("color-secondary") || "#ffffff"; // Default color if not set
  }

  createCard(data) {
    const card = this._shadowRoot.querySelector(".card");
    const gradient = `linear-gradient(to bottom, ${this.getColor()}, ${this.getSecondaryColor()})`;
    card.innerHTML = `
  <div class="cover" style="background: ${gradient}"></div>
          <div class="card-wrapper">
          <a href="https://github.com/${data.login}" target="_blank" rel="noopener">
            <img id="github-logo" src="https://i.ibb.co/frv5pB3/github-logo.png" alt="github-logo" border="0">
          </a>
          <div class="card-header">
            <div class="card-img-wrapper">
              <img src="https://avatars.githubusercontent.com/${data.login}"/>
            </div>
            <h1>
              <a class="card-title" href="${data.html_url}" target="_blank" rel="noopener">${data.name}</a>
            </h1>
            <div class="card-responsename">
              <a href="${data.html_url}" target="_blank" rel="noopener">@${data.login}</a>
            </div>
            <p class="card-desc">${data.bio ?? ""}</p>
            <div class="card-footer">
              <div class="footer-box">
                <div class="box-wrapper">
                  <div class="count">${formatNumbers(data.followers)}</div>
                  <div class="box-text">Followers</div>
                </div>   
                <div class="box-wrapper">
                  <div class="count">${formatNumbers(data.following)}</div>
                  <div class="box-text">Following</div>
                </div>  
                <div class="box-wrapper">
                  <div class="count">${formatNumbers(data.public_repos)}</div>
                  <div class="box-text">Repositories</div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    const theme = this.getAttribute("theme");
    if (theme) {
      this.setTheme(theme);
    }

    const color = this.getAttribute("color");
    if (color) {
      this.setColor(color);
    }
  }
}

if (!customElements.get("github-profile")) {
  customElements.define("github-profile", GithubProfile);
}
//module.exports = GithubProfile;  
