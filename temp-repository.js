const Gitty    = require('gitty');
const Command  = require('gitty/lib/command.js');
const tmp      = require('tmp');

class TempRepository {
  constructor () {
    this.tmpDir = tmp.dirSync({ unsafeCleanup: true });
    this.repo = new Gitty(this.tmpDir.name);
    this.path = this.tmpDir.name;

    this.repo.initSync();

    const commitCmd = () => `commit --allow-empty -m "git-jsontree (${Math.random()})"`;

    const commands = [
      new Command(this.repo, 'config --local user.name  git-jsontree'),
      new Command(this.repo, 'config --local user.email git@jsontree.dev'),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, 'checkout -b myBranch HEAD~2'),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, commitCmd()),
      new Command(this.repo, 'checkout master'),
      new Command(this.repo, 'merge myBranch'),
      new Command(this.repo, commitCmd()),
    ];

    commands.map(cmd => cmd.execSync());
  }

  clean () {
    this.tmpDir.removeCallback();
  }
}

module.exports = TempRepository;
