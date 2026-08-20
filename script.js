// ──── Axios共通設定 ────
// withCredentials: Cookie（セッションID）を毎回自動で送信する
// baseURL: 全てのリクエストの先頭に自動で付くURL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://backapp-takahashi.m3harbor.net/api";

const { createApp, ref, onMounted } = Vue;
const { createVuetify } = Vuetify;
const vuetify = createVuetify();

createApp({
  setup() {
    const ID = ref('');
    const Name = ref('');
    const dataList = ref([]);
    const dialog = ref(false);
    const message = ref('');
    const loading = ref(false);

    // ページ表示時にセッション確認（ログインしていなければログインページへ）
    onMounted(async () => {
      await checkSession();
    });

    // セッション確認処理
    const checkSession = async () => {
      loading.value = true;
      try {
        const res = await axios.get('/session');
        if (res.data.status === 'active') {
          message.value = "セッションは有効です。（ユーザー: " + res.data.userId + "）";
        } else {
          message.value = "セッションが無効です。ログインページへ移動します。";
          setTimeout(() => window.location.href = 'index.html', 2000);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          message.value = "セッションが切れました。ログインページへ移動します。";
          setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
          message.value = "セッション確認エラー：" + err.message;
        }
      } finally {
        dialog.value = true;
        loading.value = false;
      }
    };

    // ログアウト処理
    const logout = async () => {
      loading.value = true;
      try {
        await axios.post('/logout');
        message.value = "ログアウトしました。ログインページに戻ります。";
        dialog.value = true;
        setTimeout(() => window.location.href = 'index.html', 1500);
      } catch (err) {
        message.value = "ログアウトに失敗しました。";
        dialog.value = true;
      } finally {
        loading.value = false;
      }
    };

    // DB登録処理
    const addData = async () => {
      if (!ID.value || isNaN(ID.value)) {
        message.value = 'IDに数値を入力してください。';
        dialog.value = true;
        return;
      }
      try {
        const res = await axios.post('/INSERT', { ID: ID.value, Name: Name.value });
        message.value = res.data;
      } catch (err) {
        message.value = '通信エラー：' + err.message;
      } finally {
        dialog.value = true;
      }
    };

    // DB読取処理
    const readData = async () => {
      try {
        const res = await axios.get('/SELECT');
        dataList.value = res.data.List;
      } catch (err) {
        message.value = 'データ取得に失敗しました。';
        dialog.value = true;
      }
    };

    return { ID, Name, dataList, dialog, message, loading, checkSession, logout, addData, readData };
  },
})
  .use(vuetify)
  .mount('#app');