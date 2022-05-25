import styled from '@emotion/styled';
import { Divider, Paper, Typography } from '@mui/material';

const Root = styled(Paper)`
  padding: 1rem 1rem;
  margin-top: 2rem;
`;

const CodeSegment = styled.div`
  font-family: 'Roboto Mono', monospace;
  width: 100%;
  overflow-x: auto;
  background-color: #f0f2f5;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0;
  font-weight: 500;
`;

const ShellStart = styled.span`
  &::before {
    content: '$';
    padding-right: 0.5rem;
    color: #aaa;
  }
`;

const SpacedDivider = styled(Divider)`
  margin: 0.75rem 0;
`;

function Instruction() {
  return (
    <>
      <Root>
        <Typography fontWeight="bold">1. Install from git</Typography>

        <SpacedDivider />

        <Typography>Download client app from github.</Typography>

        <CodeSegment>
          <ShellStart />
          git clone https://github.com/the-dip-project/dip-client
        </CodeSegment>

        <Typography>Install dependencies.</Typography>

        <CodeSegment>
          <ShellStart />
          cd dip-client && npm install
        </CodeSegment>

        <Typography>Link client app.</Typography>

        <CodeSegment>
          <ShellStart />
          npm link
        </CodeSegment>
      </Root>

      <Root>
        <Typography fontWeight="bold">2. Connect to your account</Typography>

        <SpacedDivider />

        <Typography>
          Set server address to your config file. Your config file can be found
          in&nbsp;<kbd>~/.dip/config.json</kbd> or&nbsp;
          <kbd>%APPDATA%/.dip/config.json</kbd>. API key provides permanent
          session but very least permission.
        </Typography>

        <CodeSegment>
          <ShellStart />
          dip config set server &lt;DIP server address&gt;
        </CodeSegment>

        <Typography>
          Running this command will add API key to your config file.
        </Typography>

        <CodeSegment>
          <ShellStart />
          dip config set api-key &lt;YOUR-API-KEY&gt;
        </CodeSegment>
      </Root>

      <Root>
        <Typography fontWeight="bold">3. Listen the changes</Typography>

        <SpacedDivider />

        <Typography>
          To listen the changes of interface <kbd>int1</kbd> and update record #
          <kbd>id</kbd> with the address from network <kbd>WAN</kbd>, use
          following command:
        </Typography>

        <CodeSegment>
          <ShellStart />
          dip listen --interface &lt;int1&gt; --record &lt;id&gt; --network WAN
        </CodeSegment>
      </Root>
    </>
  );
}

export default Instruction;
