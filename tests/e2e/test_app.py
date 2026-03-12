import re
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:5173"


# ── HELPERS ───────────────────────────────────────────────────────────────────

def nav_click(page: Page, section_id: str):
    """Clica no botão de navegação do sidebar desktop (data-testid=nav-desktop)."""
    page.locator("[data-testid='nav-desktop'] [data-section='{}']".format(section_id)).click()
    page.wait_for_timeout(400)


def criar_crianca(page: Page, name: str = "Criança Teste", birth: str = "2021-01-01"):
    """Cadastra uma criança usando o formulário inicial."""
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.evaluate("localStorage.clear()")
    page.reload()
    page.wait_for_load_state("networkidle")

    page.fill("input[placeholder='Ex: Maria Silva']", name)
    page.fill("input[type='date']", birth)
    page.click("button:has-text('Cadastrar criança')")
    page.wait_for_timeout(600)


# ── PERFIL ────────────────────────────────────────────────────────────────────

class TestPerfil:
    def test_app_carrega_corretamente(self, page: Page):
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        # usar .last para pegar o span do sidebar desktop (o mobile fica display:none em md+)
        expect(page.get_by_text("Criança Saudável").last).to_be_visible()

    def test_cadastrar_primeira_crianca(self, page: Page):
        criar_crianca(page, "João Silva", "2022-05-15")
        expect(page.get_by_role("heading", name="João Silva")).to_be_visible()

    def test_calculo_automatico_de_idade(self, page: Page):
        criar_crianca(page, "Ana Idade", "2020-01-01")
        age_elem = page.locator("span.text-pink-600").filter(has_text=re.compile(r"\d+"))
        expect(age_elem).to_be_visible()

    def test_editar_perfil(self, page: Page):
        criar_crianca(page, "Teste Edit", "2021-03-10")
        page.click("button:has-text('Editar')")
        page.wait_for_timeout(300)
        page.locator("input.input-field.text-center.font-semibold").fill("Teste Editado")
        page.click("button:has-text('Salvar')")
        page.wait_for_timeout(500)
        expect(page.get_by_role("heading", name="Teste Editado")).to_be_visible()

    def test_excluir_crianca(self, page: Page):
        criar_crianca(page, "Para Deletar", "2022-01-01")
        page.on("dialog", lambda d: d.accept())
        page.click("button:has-text('Excluir')")
        page.wait_for_timeout(600)
        expect(page.get_by_role("heading", name="Para Deletar")).not_to_be_visible()

    def test_resumo_exibido(self, page: Page):
        criar_crianca(page, "Resumo Test", "2020-06-15")
        expect(page.get_by_text("Nascimento")).to_be_visible()
        expect(page.get_by_text("Idade")).to_be_visible()


# ── AGENDA MÉDICA ─────────────────────────────────────────────────────────────

class TestAgendaMedica:
    def setup(self, page: Page):
        criar_crianca(page, "Criança Agenda", "2021-01-01")
        nav_click(page, "agenda")

    def test_abre_secao_agenda(self, page: Page):
        self.setup(page)
        expect(page.locator("h1:has-text('Agenda Médica')")).to_be_visible()

    def test_calendario_exibe_dias_semana(self, page: Page):
        self.setup(page)
        for day in ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]:
            expect(page.get_by_text(day).first).to_be_visible()

    def test_navegacao_prevximo_mes(self, page: Page):
        self.setup(page)
        month_pattern = re.compile(
            r"Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro"
        )
        month_h3 = page.locator("h3").filter(has_text=month_pattern).first
        mes_antes = month_h3.inner_text()

        # Botão do próximo mês: último botão dentro do card do calendário
        calendar_card = page.locator(".card").filter(has=page.locator("h3").filter(has_text=month_pattern))
        calendar_card.locator("button").last.click()
        page.wait_for_timeout(400)

        mes_depois = month_h3.inner_text()
        assert mes_antes != mes_depois, f"Mês não mudou: '{mes_antes}' -> '{mes_depois}'"

    def test_adicionar_consulta(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova consulta')")
        page.wait_for_timeout(300)

        page.locator("form input[type='date']").fill("2026-04-15")
        page.locator("form input[type='time']").fill("14:30")
        page.fill("input[placeholder='Ex: Dr. João - Clínica Saúde']", "Dr. Pedro Pediatra")
        page.fill("textarea[placeholder*='Sintomas']", "Rotina anual")
        page.click("button:has-text('Salvar consulta')")
        page.wait_for_timeout(600)

        expect(page.locator("text=Dr. Pedro Pediatra").first).to_be_visible()

    def test_consulta_aparece_no_calendario(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova consulta')")
        page.wait_for_timeout(300)
        page.locator("form input[type='date']").fill("2026-03-20")
        page.locator("form input[type='time']").fill("09:00")
        page.fill("input[placeholder='Ex: Dr. João - Clínica Saúde']", "Clínica Central")
        page.click("button:has-text('Salvar consulta')")
        page.wait_for_timeout(600)

        # A consulta deve aparecer na lista de consultas abaixo do calendário
        expect(page.locator("text=Clínica Central").first).to_be_visible()

    def test_excluir_consulta(self, page: Page):
        self.setup(page)
        page.on("dialog", lambda d: d.accept())

        page.click("button:has-text('Nova consulta')")
        page.wait_for_timeout(300)

        page.locator("form input[type='date']").fill("2026-05-10")
        page.locator("form input[type='time']").fill("08:00")
        page.fill("input[placeholder='Ex: Dr. João - Clínica Saúde']", "Clínica Excluir")
        # Tab out of input to ensure focus leaves before clicking submit
        page.keyboard.press("Tab")
        page.wait_for_timeout(200)
        page.locator("button:has-text('Salvar consulta')").click(force=True)
        page.wait_for_timeout(600)

        apt_card = page.locator(".bg-gray-50.rounded-xl").filter(has_text="Clínica Excluir")
        apt_card.hover()
        page.wait_for_timeout(300)
        apt_card.locator("button").click(force=True)
        page.wait_for_timeout(500)

        expect(page.locator("text=Clínica Excluir")).not_to_be_visible()


# ── CURVA DE CRESCIMENTO ──────────────────────────────────────────────────────

class TestCurvaCrescimento:
    def setup(self, page: Page):
        criar_crianca(page, "Criança Crescimento", "2020-06-01")
        nav_click(page, "growth")

    def test_abre_secao_crescimento(self, page: Page):
        self.setup(page)
        expect(page.locator("h1:has-text('Curva de Crescimento')")).to_be_visible()

    def test_adicionar_medicao_peso_altura(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova medição')")
        page.wait_for_timeout(300)

        page.locator("form input[type='date']").fill("2026-01-15")
        page.fill("input[placeholder='Ex: 8.5']", "18.5")
        page.fill("input[placeholder='Ex: 72.0']", "95.0")
        page.click("button:has-text('Salvar medição')")
        page.wait_for_timeout(600)

        expect(page.locator("text=18.5").first).to_be_visible()
        expect(page.locator("text=95").first).to_be_visible()

    def test_grafico_peso_aparece(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova medição')")
        page.wait_for_timeout(300)
        page.locator("form input[type='date']").fill("2026-02-01")
        page.fill("input[placeholder='Ex: 8.5']", "20.0")
        page.fill("input[placeholder='Ex: 72.0']", "100.0")
        page.click("button:has-text('Salvar medição')")
        page.wait_for_timeout(600)

        expect(page.locator("text=Peso (kg)").first).to_be_visible()
        expect(page.locator("text=Altura (cm)").first).to_be_visible()

    def test_tabela_historico_exibida(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova medição')")
        page.wait_for_timeout(300)
        page.locator("form input[type='date']").fill("2026-01-10")
        page.fill("input[placeholder='Ex: 8.5']", "15.0")
        page.fill("input[placeholder='Ex: 72.0']", "88.0")
        page.click("button:has-text('Salvar medição')")
        page.wait_for_timeout(600)

        expect(page.get_by_text("Histórico de Medições")).to_be_visible()
        expect(page.locator("td:has-text('15')").first).to_be_visible()

    def test_excluir_medicao(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Nova medição')")
        page.wait_for_timeout(300)
        page.locator("form input[type='date']").fill("2026-01-20")
        page.fill("input[placeholder='Ex: 8.5']", "22")
        page.fill("input[placeholder='Ex: 72.0']", "")
        page.click("button:has-text('Salvar medição')")
        page.wait_for_timeout(600)

        page.on("dialog", lambda d: d.accept())
        # JS renderiza 22.0 como "22" na tabela — filtrar por "22"
        row = page.locator("tr").filter(has_text="22").last
        row.hover()
        page.wait_for_timeout(400)
        row.locator("button").click(force=True)
        page.wait_for_timeout(500)

        expect(page.locator("tr").filter(has_text="22").last).not_to_be_visible()


# ── ROTINA ALIMENTAR ──────────────────────────────────────────────────────────

class TestRotinaAlimentar:
    def setup(self, page: Page):
        criar_crianca(page, "Criança Alimentação", "2021-01-01")
        nav_click(page, "food")

    def test_abre_secao_alimentacao(self, page: Page):
        self.setup(page)
        expect(page.locator("h1:has-text('Rotina Alimentar')")).to_be_visible()

    def test_registrar_refeicao(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Registrar refeição')")
        page.wait_for_timeout(300)

        page.fill("input[placeholder*='Arroz, feijão']", "Arroz integral, frango, brócolis")
        page.click("button:has-text('Salvar refeição')")
        page.wait_for_timeout(600)

        expect(page.locator("text=Arroz integral, frango, brócolis")).to_be_visible()

    def test_opcoes_de_aceitacao_visiveis(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Registrar refeição')")
        page.wait_for_timeout(300)

        for opt in ["Boa", "Regular", "Ruim", "Recusou"]:
            expect(page.locator("form").get_by_role("button", name=opt)).to_be_visible()

    def test_selecionar_aceitacao(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Registrar refeição')")
        page.wait_for_timeout(300)

        page.locator("form").get_by_role("button", name="Recusou").click()
        page.fill("input[placeholder*='Arroz, feijão']", "Papinha de batata")
        page.click("button:has-text('Salvar refeição')")
        page.wait_for_timeout(600)

        expect(page.locator("text=Recusou").first).to_be_visible()

    def test_excluir_refeicao(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Registrar refeição')")
        page.wait_for_timeout(300)

        page.fill("input[placeholder*='Arroz, feijão']", "Refeição para deletar")
        page.click("button:has-text('Salvar refeição')")
        page.wait_for_timeout(600)

        page.on("dialog", lambda d: d.accept())
        entry_wrapper = page.locator("text=Refeição para deletar").locator("..").locator("..")
        entry_wrapper.hover()
        page.wait_for_timeout(400)
        entry_wrapper.locator("button").last.click(force=True)
        page.wait_for_timeout(500)

        expect(page.locator("text=Refeição para deletar")).not_to_be_visible()


# ── VACINAS ───────────────────────────────────────────────────────────────────

class TestVacinas:
    def setup(self, page: Page):
        criar_crianca(page, "Criança Vacinas", "2021-01-01")
        nav_click(page, "vaccines")

    def test_abre_secao_vacinas(self, page: Page):
        self.setup(page)
        expect(page.locator("h1:has-text('Histórico de Vacinas')")).to_be_visible()

    def test_adicionar_vacina_bcg(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Adicionar vacina')")
        page.wait_for_timeout(300)

        page.select_option("select", "BCG")
        page.locator("form input[type='date']").first.fill("2021-01-10")
        page.locator("form input[type='date']").last.fill("2021-01-10")
        page.click("button:has-text('Salvar vacina')")
        page.wait_for_timeout(600)

        expect(page.locator("text=BCG").first).to_be_visible()

    def test_contador_vacinas_aplicadas(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Adicionar vacina')")
        page.wait_for_timeout(300)
        page.select_option("select", "Hepatite B")
        page.locator("form input[type='date']").last.fill("2022-03-01")
        page.click("button:has-text('Salvar vacina')")
        page.wait_for_timeout(600)

        expect(page.locator(".card").filter(has_text="Aplicadas").locator("p.text-2xl")).to_be_visible()

    def test_toggle_status_pendente_para_aplicada(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Adicionar vacina')")
        page.wait_for_timeout(300)

        page.select_option("select", "Varicela")
        page.locator("form").get_by_role("button", name="Pendente").click()
        page.click("button:has-text('Salvar vacina')")
        page.wait_for_timeout(600)

        varicela_card = page.locator(".card").filter(has_text="Varicela")
        varicela_card.locator("button").first.click()
        page.wait_for_timeout(600)

        expect(varicela_card.locator("text=Aplicada").first).to_be_visible()

    def test_excluir_vacina(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Adicionar vacina')")
        page.wait_for_timeout(300)
        page.select_option("select", "Influenza (Gripe)")
        page.click("button:has-text('Salvar vacina')")
        page.wait_for_timeout(600)

        page.on("dialog", lambda d: d.accept())
        vacina_card = page.locator(".card").filter(has_text="Influenza")
        vacina_card.hover()
        page.wait_for_timeout(400)
        vacina_card.locator("button").last.click(force=True)
        page.wait_for_timeout(500)

        expect(page.locator("text=Influenza (Gripe)")).not_to_be_visible()

    def test_filtro_pendentes(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Adicionar vacina')")
        page.wait_for_timeout(300)
        page.select_option("select", "HPV")
        page.locator("form").get_by_role("button", name="Pendente").click()
        page.click("button:has-text('Salvar vacina')")
        page.wait_for_timeout(600)

        page.locator("text=Pendentes").first.click()
        page.wait_for_timeout(300)
        expect(page.locator("text=HPV").first).to_be_visible()


# ── CONTATOS DE SAÚDE ─────────────────────────────────────────────────────────

class TestContatosSaude:
    def setup(self, page: Page):
        criar_crianca(page, "Criança Contatos", "2021-01-01")
        nav_click(page, "contacts")

    def test_abre_secao_contatos(self, page: Page):
        self.setup(page)
        expect(page.locator("h1:has-text('Contatos de Saúde')")).to_be_visible()

    def test_adicionar_contato(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Novo contato')")
        page.wait_for_timeout(300)

        page.fill("input[placeholder='Ex: Dr. Maria Santos']", "Dra. Ana Lima")
        page.fill("input[placeholder='Ex: Pediatria']", "Pediatria")
        page.fill("input[placeholder='(11) 99999-9999']", "(11) 98765-4321")
        page.fill("input[placeholder='exemplo@clinica.com']", "ana@clinica.com")
        page.fill("input[placeholder*='Clínica']", "Clínica Infantil - Rua das Flores, 100")
        page.click("button:has-text('Salvar contato')")
        page.wait_for_timeout(600)

        expect(page.locator("text=Dra. Ana Lima")).to_be_visible()
        expect(page.locator("text=Pediatria").first).to_be_visible()

    def test_telefone_como_link(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Novo contato')")
        page.wait_for_timeout(300)
        page.fill("input[placeholder='Ex: Dr. Maria Santos']", "Dr. Telefone")
        page.fill("input[placeholder='(11) 99999-9999']", "(11) 12345-6789")
        page.click("button:has-text('Salvar contato')")
        page.wait_for_timeout(600)

        expect(page.locator("a[href='tel:11123456789']")).to_be_visible()

    def test_email_como_link(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Novo contato')")
        page.wait_for_timeout(300)
        page.fill("input[placeholder='Ex: Dr. Maria Santos']", "Dr. Email")
        page.fill("input[placeholder='exemplo@clinica.com']", "teste@hospital.com")
        page.click("button:has-text('Salvar contato')")
        page.wait_for_timeout(600)

        expect(page.locator("a[href='mailto:teste@hospital.com']")).to_be_visible()

    def test_excluir_contato(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Novo contato')")
        page.wait_for_timeout(300)
        page.fill("input[placeholder='Ex: Dr. Maria Santos']", "Dr. Para Deletar")
        page.click("button:has-text('Salvar contato')")
        page.wait_for_timeout(600)

        page.on("dialog", lambda d: d.accept())
        card = page.locator(".card").filter(has_text="Dr. Para Deletar")
        card.hover()
        page.wait_for_timeout(400)
        card.locator("button").last.click(force=True)
        page.wait_for_timeout(500)

        expect(page.locator("text=Dr. Para Deletar")).not_to_be_visible()


# ── PERSISTÊNCIA ──────────────────────────────────────────────────────────────

class TestPersistencia:
    def test_perfil_persiste_apos_reload(self, page: Page):
        criar_crianca(page, "Criança Persistente", "2021-07-04")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(600)

        expect(page.get_by_role("heading", name="Criança Persistente")).to_be_visible()

    def test_consulta_persiste_apos_reload(self, page: Page):
        criar_crianca(page, "Criança Agenda Persist", "2020-01-01")
        nav_click(page, "agenda")
        page.click("button:has-text('Nova consulta')")
        page.wait_for_timeout(300)

        page.locator("form input[type='date']").fill("2026-06-01")
        page.locator("form input[type='time']").fill("10:00")
        page.fill("input[placeholder='Ex: Dr. João - Clínica Saúde']", "Dr. Persistente")
        page.click("button:has-text('Salvar consulta')")
        page.wait_for_timeout(600)

        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(600)
        nav_click(page, "agenda")

        expect(page.locator("text=Dr. Persistente").first).to_be_visible()

    def test_contato_persiste_apos_reload(self, page: Page):
        criar_crianca(page, "Criança Contato Persist", "2020-01-01")
        nav_click(page, "contacts")
        page.click("button:has-text('Novo contato')")
        page.wait_for_timeout(300)
        page.fill("input[placeholder='Ex: Dr. Maria Santos']", "Dr. Salvo")
        page.click("button:has-text('Salvar contato')")
        page.wait_for_timeout(600)

        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(600)
        nav_click(page, "contacts")

        expect(page.locator("text=Dr. Salvo")).to_be_visible()


# ── NAVEGAÇÃO ─────────────────────────────────────────────────────────────────

class TestNavegacao:
    def test_navegar_todas_as_secoes(self, page: Page):
        criar_crianca(page, "Criança Nav", "2021-01-01")

        sections = [
            ("agenda", "Agenda Médica"),
            ("prescriptions", "Receitas e Exames"),
            ("growth", "Curva de Crescimento"),
            ("food", "Rotina Alimentar"),
            ("vaccines", "Histórico de Vacinas"),
            ("contacts", "Contatos de Saúde"),
            ("profile", "Perfil da Criança"),
        ]

        for section_id, expected_title in sections:
            nav_click(page, section_id)
            expect(page.locator(f"h1:has-text('{expected_title}')")).to_be_visible(timeout=5000)

    def test_sidebar_responsiva_mobile(self, page: Page):
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")

        hamburger = page.locator("button[aria-label='Abrir menu']")
        expect(hamburger).to_be_visible()

        hamburger.click()
        page.wait_for_timeout(400)

        nav_mobile = page.locator("[data-testid='nav-mobile']")
        expect(nav_mobile).to_be_visible()

    def test_sidebar_desktop_visivel(self, page: Page):
        page.set_viewport_size({"width": 1280, "height": 720})
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")

        nav_desktop = page.locator("[data-testid='nav-desktop']").last
        expect(nav_desktop).to_be_visible()
