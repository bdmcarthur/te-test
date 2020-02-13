let firstLoad = true;

$(document).ready(function () {
  fetchdata();
});

function fetchdata() {
  $.ajax({
    url: "/getCommodities",
    type: "get",
    success: function (data) {
      if (firstLoad === true) {
        addHTML(data.data);
      } else {
        updateHTML(data.data);
      }
    },
    complete: function (data) {
      setTimeout(fetchdata, 5000);
    }
  });
}

function addHTML(data) {
  let categories = ["energy", "metals", "agricultural", "livestock", "industrial", "index"];
  let tablesHtml = ""
  let currentGroup = ""

  //create separate tables for each category
  categories.map(cat => {
    tablesHtml += `<table class=${cat}><tr > <th>${cat}</th> <th>Price</th> <th>Date</th></tr></table>`
  })
  $(`.data-tables`).append(tablesHtml);

  //adds commodity to corresponding table
  data.map(commodity => {
    currentGroup = commodity.Group.toLowerCase() || "industrial" //Steel is missing Group in API
    let comHtml =
      `<tr class="${commodity.Ticker.replace(/\s+/g,'')}">` +
      `<td class="com-name">` +
      commodity.Name +
      "</td>" +
      '<td class="com-price">' +
      commodity.Last +
      "</td>" +
      `<td class="com-date">` +
      formatDate(commodity.Date) +
      `</td> ` +
      "</tr>";

    $(`.${currentGroup}`).append(comHtml);
  });
  firstLoad = false;
}

function updateHTML(data) {
  $("td").css("background-color", "inherit");
  data.map(commodity => {
    let comTicker = commodity.Ticker.replace(/\s+/g, '')
    let currentPrice = $("." + comTicker)
      .find(".com-price")
      .html();

    if (parseFloat(currentPrice) !== commodity.Last) {
      $("." + comTicker)
        .find(".com-price")
        .html(commodity.Last)
        .css("background-color", "#B5FCF1");
    }
    let currentDate = $("." + comTicker).find(".com-date").html()
    let newDate = formatDate(commodity.Date)

    if (currentDate !== newDate) {
      $("." + comTicker)
        .find(".com-date")
        .html(newDate)
    }
  });
}

function formatDate(date) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let lastDate = new Date(date);
  let formattedLastDate = lastDate.getMonth() + 1 + "/" + lastDate.getDate();
  let today = new Date();
  let formattedToday = today.getMonth() + 1 + "/" + today.getDate();

  if (formattedLastDate === formattedToday) {
    let minutes = lastDate.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    return lastDate.getHours() + ":" + minutes
  } else {
    return formattedLastDate
  }
}