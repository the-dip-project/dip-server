> This document specify how resource records are stored with extended data other than standard data in A or AAAA records.

> Extended data fields are separated with pipe `( | )` character.

<style type="text/css">
.tg {
    border-collapse: collapse;
    border-spacing: 0;
}

.tg, .tg * {
    font-family: Consolas;
    font-size: 1rem;
    overflow: hidden;
    font-weight: normal;
    word-break: normal;
}

.tg td, .tg th {
    padding: 5px 10px;
    border: 1px solid black;
}

.tg .tg-0pky {
    border-color: inherit;
}
</style>

> A record:

<table class="tg">
    <thead>
        <tr>
            <th class="tg-0pky">rrtype</th>
            <th class="tg-0pky">data</th>
            <th class="tg-0pky" colspan="6">extended_data</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="tg-0pky">A</td>
            <td class="tg-0pky">address</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">AAAA</td>
            <td class="tg-0pky">address</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">MX</td>
            <td class="tg-0pky">exchange</td>
            <td class="tg-0pky" colspan="6">priority</td>
        </tr>
        <tr>
            <td class="tg-0pky">NS</td>
            <td class="tg-0pky">nameserver</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">PTR</td>
            <td class="tg-0pky">domain</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">CNAME</td>
            <td class="tg-0pky">domain</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">SPF</td>
            <td class="tg-0pky">data</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">TXT</td>
            <td class="tg-0pky">data</td>
            <td class="tg-0pky" colspan="6">
                <span style="font-style:italic">empty</span>
            </td>
        </tr>
        <tr>
            <td class="tg-0pky">SOA</td>
            <td class="tg-0pky">primary</td>
            <td class="tg-0pky">admin</td>
            <td class="tg-0pky">serial</td>
            <td class="tg-0pky">refresh</td>
            <td class="tg-0pky">retry</td>
            <td class="tg-0pky">expiration</td>
            <td class="tg-0pky">minimum</td>
        </tr>
        <tr>
            <td class="tg-0pky">SRV</td>
            <td class="tg-0pky">target</td>
            <td class="tg-0pky" colspan="2">priority</td>
            <td class="tg-0pky" colspan="2">weight</td>
            <td class="tg-0pky" colspan="2">port</td>
        </tr>
        <tr>
            <td class="tg-0pky">CAA</td>
            <td class="tg-0pky">value</td>
            <td class="tg-0pky" colspan="3">flags</td>
            <td class="tg-0pky" colspan="3">tag</td>
        </tr>
    </tbody>
</table>
