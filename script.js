const header = document.querySelector("header");

if (header) {
  let isDragging = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

  const readOffset = (name) => {
    const raw = getComputedStyle(header).getPropertyValue(name).trim();
    const value = parseFloat(raw);
    return Number.isNaN(value) ? 0 : value;
  };

  const onPointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    const nextX = startOffsetX + (event.clientX - startPointerX);
    const nextY = startOffsetY + (event.clientY - startPointerY);

    header.style.setProperty("--drag-x", `${nextX}px`);
    header.style.setProperty("--drag-y", `${nextY}px`);
  };

  const stopDragging = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    header.classList.remove("dragging");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDragging);
    window.removeEventListener("pointercancel", stopDragging);
  };

  header.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.target.closest("a")) {
      return;
    }

    isDragging = true;
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    startOffsetX = readOffset("--drag-x");
    startOffsetY = readOffset("--drag-y");

    header.classList.add("dragging");

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  });
}
