import imgurHelper from "../../../assets/javascripts/helpers/imgur.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableImgurElement = document.getElementById("disable-imgur");
disableImgurElement.addEventListener("change",
    (event) => imgurHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        imgurHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    let i2pDiv = document.getElementsByClassName("i2p")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'i2p') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'block';
    }
}

imgurHelper.init().then(() => {
    disableImgurElement.checked = !imgurHelper.getDisable();

    let protocol = imgurHelper.getProtocol();
    console.log('protocol', protocol);
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("rimgoLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'rimgo',
            'normal',
            imgurHelper,
            document,
            imgurHelper.getRimgoNormalRedirectsChecks,
            imgurHelper.setRimgoNormalRedirectsChecks,
            imgurHelper.getRimgoNormalCustomRedirects,
            imgurHelper.setRimgoNormalCustomRedirects,
            r.rimgoLatency
        );
    });

    commonHelper.processDefaultCustomInstances(
        'rimgo',
        'tor',
        imgurHelper,
        document,
        imgurHelper.getRimgoTorRedirectsChecks,
        imgurHelper.setRimgoTorRedirectsChecks,
        imgurHelper.getRimgoTorCustomRedirects,
        imgurHelper.setRimgoTorCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'rimgo',
        'i2p',
        imgurHelper,
        document,
        imgurHelper.getRimgoI2pRedirectsChecks,
        imgurHelper.setRimgoI2pRedirectsChecks,
        imgurHelper.getRimgoI2pCustomRedirects,
        imgurHelper.setRimgoI2pCustomRedirects
    );
});

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await imgurHelper.init();
        let redirects = imgurHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.rimgo.normal).then(r => {
            browser.storage.local.set({ rimgoLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'rimgo',
                'normal',
                imgurHelper,
                document,
                imgurHelper.getRimgoNormalRedirectsChecks,
                imgurHelper.setRimgoNormalRedirectsChecks,
                imgurHelper.getRimgoNormalCustomRedirects,
                imgurHelper.setRimgoNormalCustomRedirects,
                r
            );
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
