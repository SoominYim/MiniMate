<template>
  <div class="pdfContainer" style="text-align: center">
    <div class="header">
      <div v-if="!isFile">
        <input type="radio" name="selectionType" id="choice" v-model="selectionType" value="choice" />
        <label for="choice">개별 선택</label>
        <input type="radio" name="selectionType" id="range" v-model="selectionType" value="range" />
        <label for="range">범위 선택</label>
      </div>
      <ul class="tool-bar" style="display: flex; justify-content: center; list-style-type: none; gap: 10px">
        <li v-if="isFile">
          <p>{{ fileName }}.pdf</p>
        </li>

        <li style="margin-right: 5px" v-if="!isFile" class="file_wrap">
          <input id="file" type="file" accept=".pdf" @change="changeFile" />
          <label for="file">파일 첨부</label>
        </li>
        <li v-if="isFile && selectionType == 'choice'" class="page_wrap">
          <button @click="page = page > 1 ? page - 1 : page">&lt;</button>
          <input
            type="text"
            :value="page"
            @keydown.enter="changePage"
            @focusout="resetPage"
            @input="numInput"
            style="width: 50px; text-align: right"
          />
          /
          {{ pages }}
          <button @click="page = page < pages ? page + 1 : page">&gt;</button>
        </li>
        <li v-if="isFile && selectionType == 'range'" class="rangePage_wrap">
          <span style="margin-right: 5px">total : {{ pages }}</span>
          <input
            type="text"
            id="startPage"
            :value="startPage"
            @keydown.enter="updateStartPages"
            @focusout="resetStartPage"
            @input="numInput"
          />
          /
          <input
            type="text"
            id="lastPage"
            :value="lastPage"
            @keydown.enter="updateLastPages"
            @focusout="resetLastPage"
            @input="numInput"
          />
        </li>
        <li v-if="isFile" class="scale_wrap">
          <button @click="scale = scale > 0.5 ? scale - 0.5 : scale">-</button>
          <span for="magnification">{{ Math.round(scale * 100) }}%</span>
          <button @click="scale = scale < 4 ? scale + 0.5 : scale">+</button>
        </li>
        <li v-if="isFile && selectionType == 'choice'" class="choice_wrap">
          <div class="select_wrap">
            <div class="select" :class="{ open: open }" @click="open = !open">
              {{ selectedPage.length > 0 ? page : "선택 없음" }}
            </div>
            <div class="items" v-if="open">
              <div v-if="selectedPage.length < 1">선택 없음</div>
              <div
                class="item"
                v-if="selectedPage.length > 0"
                v-for="(p, i) in selectedPage"
                :key="i"
                @click="page = p.page"
              >
                <div>
                  {{ p.page }}
                </div>
                <button @click="deletePage(i)">X</button>
              </div>
            </div>
          </div>
          <button @click="selectChoicePage">선택</button>
        </li>

        <li v-if="isFile && selectionType == 'choice'" class="export_wrap">
          <button @click="exportChoiceHTML">내보내기</button>
        </li>
        <li v-if="isFile && selectionType == 'range'" class="export_wrap">
          <button @click="exportRangeHTML">내보내기</button>
        </li>
        <li v-if="isFile && selectionType == 'range'">
          <span style="color: red"> * 렌더링이 완료되면 눌러주세요 </span>
        </li>
      </ul>
    </div>
    <div
      v-if="selectionType == 'range'"
      class="content"
      ref="content"
      :style="{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }"
    >
      <div class="pdf_wrap" v-for="page in filteredPages" :key="page">
        <VuePDF @loaded="onLoaded" ref="vuePDFRef" :scale="scale" :pdf="pdf" :page="page" :text-layer="text_layer">
          <div class="loading-overlay">
            <div class="loader"></div></div
        ></VuePDF>
      </div>
    </div>
    <div v-if="selectionType == 'choice'" class="content" ref="content" :style="{}">
      <div class="pdf_wrap">
        <VuePDF @loaded="onLoaded" ref="vuePDFRef" :scale="scale" :pdf="pdf" :page="page" :text-layer="text_layer"
          ><div class="loading-overlay">
            <div class="loader"></div>
          </div>
        </VuePDF>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from "vue";
  import { VuePDF, usePDF } from "@tato30/vue-pdf";
  import JSZip from "jszip";
  import cssContent from "../../assets/style/pdf/style";
  import meta from "../../data/meta";
  import * as PDFJS from "../../node_modules/pdfjs-dist";
  import * as pdfjsWorker from "../../node_modules/pdfjs-dist/build/pdf.worker.min.js";

  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  interface PageItem {
    html: Node;
    page: number;
    data: string;
  }

  const file = ref<string | null>(null);
  const { pdf, pages } = usePDF(file);

  const text_layer = ref(true);

  const scale = ref(1);
  const page = ref(1);
  const fileName = ref("");
  const isFile = ref(false);
  const selectedPage = ref<Array<PageItem>>([]);
  const selectionType = ref("choice");

  const open = ref(false);

  // common START

  useHead(meta.pdf);
  const HTML: HTMLHtmlElement | null = document.querySelector("html");
  if (HTML) {
    HTML.style.overflow = "hidden";
    onUnmounted(() => {
      HTML.style.overflow = "";
    });
  }
  function changeFile(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      file.value = URL.createObjectURL(selectedFile);
      fileName.value = selectedFile.name.split(".").slice(0, -1).join(".");
      isFile.value = true;
    }
  }

  const removeBrTags = () => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && node.tagName === "BR") {
              node.remove();
            }
          });
        }
      });
    });

    const pdfWrapElements = document.querySelectorAll(".pdf_wrap");
    pdfWrapElements.forEach((pdfWrapElement) => {
      observer.observe(pdfWrapElement, { childList: true, subtree: true });
    });
  };

  let isCtrl = false;
  document.addEventListener("keydown", function (e) {
    if (e.which === 17) {
      isCtrl = true;
    }
    if (e.ctrlKey) {
      if (e.key === "-") {
        e.preventDefault();
        if (scale.value > 1) {
          scale.value -= 0.5;
        }
      } else if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        if (scale.value < 4) {
          scale.value += 0.5;
        }
      }
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.which === 17) {
      isCtrl = false;
    }
  });

  document.addEventListener(
    "wheel",
    function (e) {
      if (isCtrl) {
        e.preventDefault();
        if (e.deltaY > 0) {
          if (scale.value > 0.5) {
            scale.value -= 0.5;
          }
        } else if (e.deltaY < 0) {
          if (scale.value < 4) {
            scale.value += 0.5;
          }
        }
      }
    },
    { passive: false }
  );

  /**
   * @param {string} a
   * @param {string} b
   * @param {string} c
   */

  function removeEl(parentNode: Element, a: string, b: string, c: string) {
    const elementsToRemove = parentNode.querySelectorAll(a);
    const elementsToRemoveClasses = parentNode.querySelectorAll(b);
    const elementsToRemoveStyle = parentNode.querySelectorAll(c);
    elementsToRemoveClasses.forEach((element) => {
      element.className = "";
    });
    elementsToRemove.forEach((element) => {
      if (element.parentNode) element.parentNode.removeChild(element);
    });
    elementsToRemoveStyle.forEach((element) => {
      element.removeAttribute("style");
    });
  }

  let wheelTimer: NodeJS.Timeout; // 휠 이벤트 종료를 감지하기 위한 타이머 변수

  function onLoaded() {
    removeBrTags();
    text_layer.value = false;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      text_layer.value = true;
    }, 500);
  }

  function numInput(e: any) {
    const regex = /[^0-9]/g;
    if (e.target) {
      if (regex.test(e.target.value)) {
        e.target.value = e.target.value.replace(regex, "");
      }
    }
  }

  // common END

  // 개별 선택 START
  const startPage = ref(1);
  const lastPage = ref(1);

  function changePage(e: any) {
    e.target.value > pages.value || e.target.value < 1 ? (e.target.value = page.value) : (page.value = +e.target.value);
  }

  function resetPage(e: any) {
    e.target.value = page.value;
  }

  const filteredPages = computed(() =>
    Array.from({ length: lastPage.value - startPage.value + 1 }, (_, i) => startPage.value + i)
  );

  function selectChoicePage() {
    const a = document.querySelector("canvas");
    if (!a) return;
    const canvasDataURL = a.toDataURL();
    const isNewPageUnique = !selectedPage.value.some((item) => item.page === page.value);
    const contentHTML: HTMLElement | null = document.querySelector("html");
    if (!contentHTML) return;
    if (isNewPageUnique) {
      const clonedHTML = contentHTML.cloneNode(true);
      selectedPage.value.push({
        html: clonedHTML,
        page: page.value,
        data: canvasDataURL,
      });
    }

    selectedPage.value.sort((a, b) => a.page - b.page);
  }

  function deletePage(i: number) {
    selectedPage.value.splice(i, 1);
  }

  function modifyHTML(contentHTML: Element, page: number) {
    const elReSelector =
      "#header, .header, script, style, .v-overlay-container,link:not([href='./css/common.css']), noscript, meta, #teleports, #vue-inspector-container, #nuxt-devtools-container, .v-toolbar, .v-navigation-drawer";
    const elReClassSelector = ".v-application";
    const elReStyleSelector = ".v-main";

    removeEl(contentHTML, elReSelector, elReClassSelector, elReStyleSelector);

    const titleElement = contentHTML.querySelector("title");
    if (titleElement) titleElement.textContent = `${fileName.value}_${String(page).padStart(3, "0")}`;
  }

  function exportChoiceHTML() {
    const zip = new JSZip(); // ZIP 객체 생성
    if (selectedPage.value.length < 1) selectChoicePage();
    selectedPage.value.forEach((v) => {
      // 페이지 별로 HTML 복제 및 수정
      const contentHTML = v.html as Element;

      modifyHTML(contentHTML, v.page);

      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "./css/common.css";
      const HEAD = contentHTML.querySelector("head");
      if (HEAD) {
        HEAD.appendChild(linkElement);
      }

      // 스크립트 직접 추가
      const scriptContent = `
            let canvas = document.querySelector("canvas");
            const context = canvas.getContext("2d");
            const base_image = new Image();
            base_image.src = "${v.data}";
            base_image.onload = function () {
                canvas.width = base_image.width;
                canvas.height = base_image.height;
                context.drawImage(base_image, 0, 0);
            };
        `;
      const scriptFileName = `${fileName.value}_${String(v.page).padStart(3, "0")}.js`;
      const zipJsFolder = zip.folder("js");
      if (zipJsFolder) {
        zipJsFolder.file(scriptFileName, scriptContent);
      }
      const scriptElement = document.createElement("script");
      scriptElement.src = `./js/${scriptFileName}`;

      const BODY = contentHTML.querySelector("body");

      if (BODY) {
        BODY.appendChild(scriptElement);
      }

      // Blob 생성 및 ZIP 파일에 추가
      const blob = new Blob([contentHTML.innerHTML], { type: "text/html" });
      zip.file(`${fileName.value}_${String(v.page).padStart(3, "0")}.html`, blob);
    });
    const zipCssFolder = zip.folder("css");
    if (zipCssFolder) {
      zipCssFolder.file("common.css", cssContent);
    }

    zip.generateAsync({ type: "blob" }).then((resZip) => {
      const url = URL.createObjectURL(resZip);
      const aTag = document.createElement("a");

      aTag.download = fileName.value;
      aTag.href = url;
      aTag.click();
    });
  }
  // 개별 선택 END

  // 범위 선택 START

  function updateStartPages(e: any) {
    if (e.target.value > pages.value || e.target.value < 1 || e.target.value > lastPage.value) {
      e.target.value = startPage.value;
    } else {
      startPage.value = +e.target.value;
    }
  }
  function updateLastPages(e: any) {
    if (e.target.value > pages.value || e.target.value < 1 || e.target.value < startPage.value) {
      e.target.value = lastPage.value;
    } else {
      lastPage.value = +e.target.value;
    }
  }
  function resetStartPage(e: any) {
    e.target.value = startPage.value;
  }
  function resetLastPage(e: any) {
    e.target.value = lastPage.value;
  }

  function exportRangeHTML() {
    const zip = new JSZip();
    filteredPages.value.forEach((v, i) => {
      const HTML = document.querySelector("html");
      if (!HTML) return;
      const contentHTML = HTML.cloneNode(true) as Element;
      modifyHTML(contentHTML, v);

      const _pdf = document.querySelectorAll(".pdf_wrap");
      const pdfWrap = _pdf[i].cloneNode(true);

      console.log(pdfWrap);
      const contentNode = contentHTML.querySelector(".content");
      if (contentNode) contentNode.appendChild(pdfWrap);

      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "./css/common.css";
      const HEAD = contentHTML.querySelector("head");
      if (HEAD) {
        HEAD.appendChild(linkElement);
      }

      const canvas = document.querySelectorAll("canvas")[i];
      const scriptContent = `
            let canvas = document.querySelector("canvas");
            const context = canvas.getContext("2d");
            const base_image = new Image();
            base_image.src = "${canvas.toDataURL()}";
            base_image.onload = function () {
                canvas.width = base_image.width;
                canvas.height = base_image.height;
                context.drawImage(base_image, 0, 0);
            };
        `;
      const scriptFileName = `${fileName.value}_${String(v).padStart(3, "0")}.js`;
      const zipJsFolder = zip.folder("js");
      if (zipJsFolder) {
        zipJsFolder.file(scriptFileName, scriptContent);
      }
      const scriptElement = document.createElement("script");
      scriptElement.src = `./js/${scriptFileName}`;
      const BODY = contentHTML.querySelector("body");

      if (BODY) {
        BODY.appendChild(scriptElement);
      }
      // Blob 생성 및 ZIP 파일에 추가
      const blob = new Blob([contentHTML.innerHTML], { type: "text/html" });
      zip.file(`${fileName.value}_${String(v).padStart(3, "0")}.html`, blob);
    });

    const zipCssFolder = zip.folder("css");
    if (zipCssFolder) {
      zipCssFolder.file("common.css", cssContent);
    }
    zip.generateAsync({ type: "blob" }).then((resZip) => {
      const url = URL.createObjectURL(resZip);
      const aTag = document.createElement("a");

      aTag.download = fileName.value;
      aTag.href = url;
      aTag.click();
    });
  }

  // 범위 선택 END
</script>

<style lang="scss">
  @import "/assets/style/pdf/pdf.scss";
  @import "/assets/style/pdf/annotationLayer.css";
</style>
