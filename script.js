const header = document.querySelector("header");
const recycleBin = document.querySelector(".drag-endpoint");
const deleteModal = document.querySelector(".delete-modal");
const deleteConfirm = document.querySelector(".delete-confirm");
const deleteCancel = document.querySelector(".delete-cancel");

if (header) {
  let isDragging = false;
  let isConfirmOpen = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

  const openDeleteConfirm = () => {
    if (!deleteModal) {
      header.classList.add("deleted");
      return;
    }

    isConfirmOpen = true;
    deleteModal.classList.add("open");
    deleteModal.setAttribute("aria-hidden", "false");
  };

  const closeDeleteConfirm = () => {
    if (!deleteModal) {
      return;
    }

    isConfirmOpen = false;
    deleteModal.classList.remove("open");
    deleteModal.setAttribute("aria-hidden", "true");
  };

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

  const isOverRecycleBin = () => {
    if (!recycleBin || header.classList.contains("deleted")) {
      return false;
    }

    const headerRect = header.getBoundingClientRect();
    const recycleRect = recycleBin.getBoundingClientRect();

    return !(
      headerRect.right < recycleRect.left ||
      headerRect.left > recycleRect.right ||
      headerRect.bottom < recycleRect.top ||
      headerRect.top > recycleRect.bottom
    );
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

    if (isOverRecycleBin()) {
      openDeleteConfirm();
    }
  };

  header.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.target.closest("a")) {
      return;
    }

    if (isConfirmOpen || header.classList.contains("deleted")) {
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

  if (deleteConfirm) {
    deleteConfirm.addEventListener("click", () => {
      header.classList.add("deleted");
      closeDeleteConfirm();
    });
  }

  if (deleteCancel) {
    deleteCancel.addEventListener("click", () => {
      closeDeleteConfirm();
    });
  }
}
