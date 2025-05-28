document.addEventListener('DOMContentLoaded', () => {
// --- 必要なHTML要素を取得 ---
const topicButtons = document.querySelectorAll('.topic-selector a'); 
const inputPlaceholder = document.getElementById('input-placeholder'); 
const textInput = document.getElementById('text-input'); // 本物の入力欄を追加
const sendButton = document.getElementById('send-button');

// --- 状態を管理するための変数を準備 ---
let mode = 'topic_selection'; // 'topic_selection' (トピック選択) or 'free_text' (自由入力)
let selectedUrl = null; 
let selectedButton = null;
const defaultPlaceholderText = '興味のあるトピックを選択してください'; 

// --- 1. ダミーの入力欄がクリックされた時の処理 ---
inputPlaceholder.addEventListener('click', () => {
    // 自由入力モードに切り替え
    mode = 'free_text'; 
    // ダミーの入力欄を隠し、本物の入力欄を表示
    inputPlaceholder.style.display = 'none';
    textInput.style.display = 'block';
    // 入力欄に自動でカーソルを合わせる
    textInput.focus();
    // もしトピックが選択状態だったら解除する
    if (selectedButton) {
        selectedButton.classList.remove('active');
        selectedButton = null;
        selectedUrl = null;
    }
});

// --- 2. トピックボタンがクリックされた時の処理 ---
topicButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        // トピック選択モードに切り替え
        mode = 'topic_selection';
        // 本物の入力欄を隠し、ダミーの入力欄を表示
        textInput.style.display = 'none';
        inputPlaceholder.style.display = 'block';

        // 以前の選択状態を解除
        if (selectedButton) {
            selectedButton.classList.remove('active');
        }

        // クリックされたボタンからデータを取得し、状態を更新
        const text = button.dataset.text; 
        const url = button.dataset.url;   
        inputPlaceholder.textContent = text;
        selectedUrl = url;
        selectedButton = button;
        selectedButton.classList.add('active');
    });

    // === ▼▼▼ ここからダブルクリック処理を追記します ▼▼▼ ===
    button.addEventListener('dblclick', (event) => {
        // ダブルクリック時のデフォルトの動作をキャンセル
        event.preventDefault(); 

        // data-url属性から遷移先のURLを取得
        const url = button.dataset.url;

        // URLが取得できたら、そのページに遷移する
        if (url) {
            window.location.href = url;
        }
    });
});

// --- 3. 送信ボタン（手書き画像）がクリックされた時の処理 ---
sendButton.addEventListener('click', () => {
    // モードによって処理を分岐
    if (mode === 'topic_selection') {
        // トピック選択モードの場合：ページ遷移
        if (selectedUrl) {
            window.location.href = selectedUrl;
        }
    } else if (mode === 'free_text') {
        // 自由入力モードの場合：mailtoでメールを送信
        const message = textInput.value;
        // 入力欄が空でなければ処理を実行
        if (message.trim() !== '') {
            // ▼▼▼ ご自身のメールアドレスに変更してください ▼▼▼
            const yourEmail = 'yohtacontact[at]gmail.com'; 
            
            const subject = 'ウェブサイトからのメッセージ';
            // 日本語や記号を正しく送信するためにエンコードする
            const body = encodeURIComponent(message);
            
            const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
        }
    }
});

// --- 4. Enterキーで送信する処理を追加 ---
textInput.addEventListener('keydown', (event) => {
    // 押されたキーが 'Enter' キーかどうかをチェック
    if (event.key === 'Enter') {
        // Enterキーのデフォルトの動作（改行など）をキャンセル
        event.preventDefault();
        
        // プログラム的に送信ボタンのクリックイベントを発生させる
        sendButton.click();
    }
});

// --- 5. 無限スクロールの初期設定 ---
const scrollers = document.querySelectorAll(".scroller");

// もしブラウザが prefers-reduced-motion をサポートしていなければ、アニメーションを追加
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    // scrollerに "data-animated" 属性を追加
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".scroller-inner");
    const scrollerContent = Array.from(scrollerInner.children);

    // ループのために、中身を複製して追加する
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true); // スクリーンリーダーが重複して読み上げないようにする
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// --- 6. ものおき（段ボール）のサウンドエフェクト ---

// 必要なHTML要素を取得
const monookiLink = document.querySelector('.monooki-link');
const boxSound = document.getElementById('box-sound');

    if (monookiLink && boxSound) { // 要素が存在するかチェック
        monookiLink.addEventListener('mouseenter', () => {
            boxSound.currentTime = 0;
            boxSound.play().catch(error => {
                // ユーザーがページを操作する前に音を鳴らそうとするとエラーが出ることがある
                // コンソールにエラーを表示させないようにする
                // console.log("Audio play was prevented.", error);
            });
        });
    }

    // ▲▲▲ ここまでが、DOMContentLoadedの中です ▲▲▲
});