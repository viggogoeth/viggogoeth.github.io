function tileButtonToggleActiveListener(element) {
    console.log("adding" ,element)
    element.addEventListener("click", function() {
        if (!this.classList.contains("active")) {
            this.classList.toggle("active");
        }
        
        const tileBtns = document.querySelectorAll(".tile-btn");
        tileBtns.forEach( (btn) => {
            if (btn.classList.contains("active") && btn.id != element.id) {
                btn.classList.toggle("active");
            }
        });

    });
}

const uiTileBtns = document.querySelectorAll(".tile-btn");
uiTileBtns.forEach((btn) => tileButtonToggleActiveListener(btn));


function toolButtonToggleActiveListener(element) {
    document.getElementById(element).addEventListener("click", function() {
        if (!this.classList.contains("tile-btn")) {
            this.classList.toggle("active");
        }

        const toolBtns = document.querySelectorAll(".tool-btn");
        toolBtns.forEach( (btn) => {
            if (btn.classList.contains("active") && btn.id != element) {
                btn.classList.toggle("active");
            }
        })
    })
}

toolButtonToggleActiveListener("erase-tool");
toolButtonToggleActiveListener("bucket-tool");