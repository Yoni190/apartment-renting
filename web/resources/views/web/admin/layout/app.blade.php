<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Apartment')</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">


      <style>
        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        main {
            flex: 1;
            transition: margin-left 220ms ease;
        }
        .sidebar {
            min-height: 100vh;
            background-color: #f8f9fa;
            border-right: 1px solid #dee2e6;
            transition: width 220ms ease, transform 220ms ease;
        }

        /* ensure header brand is not overlapped by the collapsed fixed sidebar */
        header .navbar {
            transition: margin-left 220ms ease;
            z-index: 1060; /* keep header above the collapsed sidebar */
        }

        /* sidebar widths */
        :root {
            --sidebar-expanded-width: 200px; /* default open width (smaller than bootstrap col) */
            --sidebar-collapsed-width: 56px; /* thin collapsed width */
        }
        /* make the admin sidebar slightly narrower than bootstrap columns */
        #adminSidebar {
            flex: 0 0 var(--sidebar-expanded-width) !important;
            width: var(--sidebar-expanded-width) !important;
            max-width: var(--sidebar-expanded-width) !important;
        }
        body.sidebar-collapsed .sidebar {
            width: var(--sidebar-collapsed-width) !important;
            min-width: var(--sidebar-collapsed-width) !important;
            max-width: var(--sidebar-collapsed-width) !important;
            overflow: hidden;
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1040;
        }
        /* push the header content to the right so the brand is visible */
        
        /* Ensure main content uses the full remaining width (no leftover column gaps)
           so apartment lists and tables can use all available horizontal space. */
        body.sidebar-collapsed main#adminMain {
            margin-left: var(--sidebar-collapsed-width) !important;
            width: calc(100% - var(--sidebar-collapsed-width)) !important;
            max-width: calc(100% - var(--sidebar-collapsed-width)) !important;
        }

        /* Also override the Bootstrap column flex on the nav column so the grid
           doesn't reserve the original column width when collapsed. */
        body.sidebar-collapsed #adminSidebar {
            flex: 0 0 var(--sidebar-collapsed-width) !important;
            width: var(--sidebar-collapsed-width) !important;
            max-width: var(--sidebar-collapsed-width) !important;
        }

        /* center the sidebar's internal toggle when collapsed */
        body.sidebar-collapsed nav.sidebar .sidebar-toggle-wrap {
            justify-content: center !important;
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
        }
        /* keep a visible affordance on the collapsed bar */
        body.sidebar-collapsed nav.sidebar .sidebar-toggle-wrap #sidebarToggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        /* compact the nav links when collapsed: show only leading glyphs/icons */
        nav.sidebar .nav-link {
            display: flex;
            align-items: center;
            gap: .5rem;
        }
        body.sidebar-collapsed nav.sidebar .nav-link {
            justify-content: center;
            padding-left: .25rem;
            padding-right: .25rem;
            overflow: hidden;
            white-space: nowrap;
        }
        /* When collapsed: hide everything inside the sidebar except the toggle
           so the main content area is the primary focus. The thin bar remains
           as an affordance to re-open the menu. */
        body.sidebar-collapsed nav.sidebar > .d-flex:not(.sidebar-toggle-wrap) {
            display: none !important;
        }
        body.sidebar-collapsed nav.sidebar .nav {
            display: none !important;
        }
        /* keep the collapsed bar visually minimal */
        body.sidebar-collapsed nav.sidebar {
            border-right: none;
            background-color: transparent;
        }
      </style>
      @stack('styles')
</head>
<body>
    <header>
        @include('web.admin.layout.header')
    </header>

    <div class="container-fluid">
        <div class="row">
            <nav id="adminSidebar" class="col-md-3 col-lg-2 d-md-block sidebar py-3">
                

                @include('web.admin.layout.sidebar')
            </nav>

            <main id="adminMain" class="col-md-9 col-lg-10 py-3">
                @yield('content')
            </main>
        </div>
    </div>
    

    <footer>

    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script>
        const toastElList = [].slice.call(document.querySelectorAll('.toast'))
        const toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl, { delay: 4000, autohide: true });
        });
        toastList.forEach(toast => toast.show());
    </script>
    <script>
        // Sidebar collapse/expand (thin collapsed bar on the left)
        (function () {
            const KEY = 'adminSidebarCollapsed'
            const body = document.body
            const toggle = document.getElementById('sidebarToggle')

            function applyState(collapsed) {
                if (collapsed) body.classList.add('sidebar-collapsed')
                else body.classList.remove('sidebar-collapsed')
            }

            // init from storage
            try {
                const stored = localStorage.getItem(KEY)
                applyState(stored === '1')
            } catch (e) {
                // ignore
            }

            if (toggle) {
                toggle.addEventListener('click', function (e) {
                    e && e.preventDefault()
                    const collapsed = !body.classList.contains('sidebar-collapsed')
                    applyState(collapsed)
                    try { localStorage.setItem(KEY, collapsed ? '1' : '0') } catch (err) {}
                })
            }
        })()
    </script>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    @stack('scripts')
</body>
</html>